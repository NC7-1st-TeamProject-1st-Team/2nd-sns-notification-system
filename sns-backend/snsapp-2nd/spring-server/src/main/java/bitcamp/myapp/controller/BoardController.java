package bitcamp.myapp.controller;

import bitcamp.myapp.service.BoardCommentService;
import bitcamp.myapp.service.BoardService;
import bitcamp.myapp.service.MemberService;
import bitcamp.myapp.service.NcpObjectStorageService;
import bitcamp.myapp.service.RedisService;
import bitcamp.myapp.vo.Board;
import bitcamp.myapp.vo.BoardComment;
import bitcamp.myapp.vo.BoardPhoto;
import bitcamp.myapp.vo.LoginUser;
import bitcamp.myapp.vo.Member;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.MatrixVariable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/board")
public class BoardController {

  @Autowired
  MemberService memberService;
  @Autowired
  BoardService boardService;
  @Autowired
  BoardCommentService boardCommentService;
  @Autowired
  NcpObjectStorageService ncpObjectStorageService;
  @Autowired
  RedisService redisService;

  {
    System.out.println("BoardController 생성됨!");
  }

  @GetMapping("form")
  public void form() throws Exception {
  }

  @PostMapping("add")
  public ResponseEntity add(@RequestPart("data") Board board,
      @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
    System.out.println(board);
//    Member loginUser = board.getWriter();
//    if (loginUser == null) {
//      return new ResponseEntity<>("not exist writer", HttpStatus.BAD_REQUEST);
//    }

    try {
      ArrayList<BoardPhoto> attachedFiles = new ArrayList<>();
      if (files != null) {
        for (MultipartFile part : files) {
          if (part.getSize() > 0) {
            String uploadFileUrl = ncpObjectStorageService.uploadFile(
                "bitcamp-nc7-bucket-14", "sns_board/", part);
            BoardPhoto attachedFile = new BoardPhoto();
            attachedFile.setFilePath(uploadFileUrl);
            attachedFiles.add(attachedFile);
          }
        }
      }
      board.setAttachedFiles(attachedFiles);

      boardService.add(board);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return new ResponseEntity<>(board, HttpStatus.OK);
  }

  @DeleteMapping("delete/{boardNo}")
  public ResponseEntity delete(
      @PathVariable int boardNo,
      @RequestParam int category,
      @CookieValue(value = "sessionId", required = false) Cookie sessionCookie) throws Exception {
    Board b = boardService.get(boardNo);

    LoginUser loginUserObject = null;
    try {
      String sessionId = sessionCookie.getValue();
      String temp = (String) redisService.getValueOps().get(sessionId);
      if (temp != null) {
        int loginUserNo = Integer.parseInt(temp);
        loginUserObject = new LoginUser(memberService.get(loginUserNo));
        if (b == null || b.getWriter().getNo() != loginUserObject.getNo()) {
          return new ResponseEntity<>("게시글이 없거나 삭제 권한이 없습니다.", HttpStatus.FORBIDDEN);
        } else {
          boardService.delete(b.getNo());
          return new ResponseEntity<>(HttpStatus.OK);
        }
      } else { // 해당하는 유저가 없을 경우
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
      }
    } catch (Exception e) {
      e.printStackTrace();
      // 예외 발생 시 처리
      return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("detail")
  public ResponseEntity<Map<String, Object>> detail(
      int category,
      int boardNo) throws Exception {

    Map<String, Object> response = new HashMap<>();

    Board board = boardService.get(boardNo);
    if (board != null) {
      boardService.increaseViewCount(boardNo);
      response.put("board", board);
    }

    // 좋아요 누른 사람들 닉네임 조회
    List<String> likedUserNicknames = boardService.boardlikelist(boardNo);
    response.put("likedUserNicknames", likedUserNicknames);

    // 댓글 조회
    List<BoardComment> comments = boardCommentService.list(boardNo);
    response.put("comments", comments);

    return new ResponseEntity<>(response, HttpStatus.OK);
  }


  @GetMapping("list")
  public ResponseEntity<Map<String, Object>> list(
      @RequestParam int category,
      @RequestParam(defaultValue = "") String keyword,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "5") int pageSize,
      Model model, HttpSession session) throws Exception {

    Member loginUser = (Member) session.getAttribute("loginUser");
    List<Board> boardList;
    int totalRecords;

    if (loginUser != null) {
      List<Integer> likedBoards = boardService.likelist(loginUser.getNo());
      model.addAttribute("likedBoards", likedBoards);
    }

    if ("".equals(keyword)) {
      boardList = boardService.list(category, pageSize, page);
      totalRecords = boardService.getTotalCount(category);
    } else {
      boardList = boardService.searchBoardsList(category, keyword, pageSize, page);
      totalRecords = boardService.getSearchBoardsCount(keyword);
    }

    int lastPage = (totalRecords + (pageSize - 1)) / pageSize;

    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put("boardList", boardList);
    resultMap.put("lastPage", lastPage);
    resultMap.put("currentPage", page);
    resultMap.put("pageSize", pageSize);
    resultMap.put("totalRecords", totalRecords);

    if (category == 1) {
      return ResponseEntity.ok(resultMap);
    } else {
      return ResponseEntity.badRequest()
          .body(Collections.singletonMap("error", "유효하지 않은 카테고리입니다."));
    }
  }


  @PostMapping("list/{category}")
  public String searchBoards(
      @PathVariable int category,
      @RequestParam("keyword") String keyword,
      @RequestParam(defaultValue = "1") int page) throws Exception {
    String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
    String queryString = String.format("&keyword=%s&page=%d", encodedKeyword, page);

    return "redirect:/board/list?category=" + category + queryString;
  }

  @PostMapping("update")
  public ResponseEntity update(@RequestPart("data") Board board,
      @RequestPart(value = "files", required = false) MultipartFile[] files) throws Exception {
    System.out.println(board);
    try {
      ArrayList<BoardPhoto> attachedFiles = new ArrayList<>();
      if (files != null) {
        for (MultipartFile part : files) {
          if (part.getSize() > 0) {
            String uploadFileUrl = ncpObjectStorageService.uploadFile(
                "bitcamp-nc7-bucket-14", "sns_board/", part);
            BoardPhoto attachedFile = new BoardPhoto();
            attachedFile.setFilePath(uploadFileUrl);
            attachedFiles.add(attachedFile);
          }
        }
      }
      board.setAttachedFiles(attachedFiles);

      boardService.update(board);
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new ResponseEntity<>(boardService.get(board.getNo()), HttpStatus.OK);
  }

  @DeleteMapping("fileDelete/{fileNo}") // 예) .../fileDelete/attachedfile;no=30
  public ResponseEntity fileDelete(@PathVariable int fileNo) throws Exception {
    Board board = null;
    BoardPhoto attachedFile = boardService.getAttachedFile(fileNo);
    board = boardService.get(attachedFile.getBoardNo());

    if (boardService.deleteAttachedFile(fileNo) == 0) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    } else {
      boardService.deleteAttachedFile(fileNo);
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  // 좋아요 기능
  @PostMapping("like")
  public ResponseEntity like(@RequestParam int boardNo,
      @CookieValue("sessionId") Cookie sessionCookie) throws Exception {
    try {
      String sessionId = sessionCookie.getValue();
      int loginUserNo = Integer.parseInt((String) redisService.getValueOps().get(sessionId));
      Member loginUser = memberService.get(loginUserNo);
      Board board = boardService.get(boardNo);

      if (board == null) {
        return new ResponseEntity<>(boardNo, HttpStatus.NOT_FOUND);
      }

      boardService.like(loginUser, board);
      return new ResponseEntity<>(boardNo, HttpStatus.OK);
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>(boardNo, HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("unlike")
  public ResponseEntity unlike(@RequestParam int boardNo,
      @CookieValue("sessionId") Cookie sessionCookie) throws Exception {
    try {
      String sessionId = sessionCookie.getValue();
      int loginUserNo = Integer.parseInt((String) redisService.getValueOps().get(sessionId));
      Member loginUser = memberService.get(loginUserNo);
      Board board = boardService.get(boardNo);

      if (board == null) {
        return new ResponseEntity<>(boardNo, HttpStatus.NOT_FOUND);
      }

      boardService.unlike(loginUser, board);
      return new ResponseEntity<>(boardNo, HttpStatus.OK);
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>(boardNo, HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("/likedBoards")
  public ResponseEntity<List<Integer>> getLikedBoards(HttpSession session) {
    try {
      Member loginUser = (Member) session.getAttribute("loginUser");
      if (loginUser == null) {
        // 로그인되지 않은 경우
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      List<Integer> likedBoards = boardService.likelist(loginUser.getNo());
      return new ResponseEntity<>(likedBoards, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // 댓글 기능
  @PostMapping("addComment")
  public ResponseEntity addComment(@RequestBody BoardComment boardComment)
      throws Exception {
    System.out.println(boardComment);
//    Member loginUser = boardComment.getWriter();
//
//    if (loginUser == null) {
//      return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
//    }

    try {
      boardCommentService.add(boardComment);

    } catch (Exception e) {
      e.printStackTrace();
    }
    return new ResponseEntity<>(boardComment, HttpStatus.OK);
  }

  @GetMapping("detailComment/{boardNo}/{no}")
  public String detailComment(@PathVariable int boardNo, @PathVariable int no, Model model)
      throws Exception {
    BoardComment boardComment = boardCommentService.get(no, boardNo);
    if (boardComment != null) {
      model.addAttribute("boardComment", boardComment);
    }

    return "board/updateComment";
  }

  @PostMapping("updateComment")
  public String updateComment(
      @RequestParam int boardNo,
      BoardComment boardComment,
      HttpSession session) throws Exception {
    Member loginUser = (Member) session.getAttribute("loginUser");
    if (loginUser == null) {
      return "redirect:/auth/form";
    }

    boardComment.setBoardNo(boardNo);
    BoardComment b = boardCommentService.get(boardComment.getNo(), boardComment.getBoardNo());
    if (b == null || b.getWriter().getNo() != loginUser.getNo()) {
      throw new Exception("댓글이 존재하지 않거나 변경 권한이 없습니다.");
    }

    boardCommentService.update(boardComment);
    return "redirect:/board/detail/1/" + boardComment.getBoardNo();
  }

  @DeleteMapping("deleteComment/{boardNo}/{commentNo}")
  public ResponseEntity deleteComment(
      @PathVariable int commentNo,
      @PathVariable int boardNo,
      HttpServletRequest request,
      HttpServletResponse response) {

    try {
      // 1. 'sessionId' 쿠키에서 값 가져오기
      String sessionId = null;
      Cookie[] cookies = request.getCookies();
      if (cookies != null) {
        for (Cookie cookie : cookies) {
          if ("sessionId".equals(cookie.getName())) {
            sessionId = cookie.getValue();
            break;
          }
        }
      }

      if (sessionId == null) {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      // 2. Redis에서 해당 sessionId로 사용자 정보를 가져오기
      String loginUserNoStr = (String) redisService.getValueOps().get(sessionId);
      if (loginUserNoStr == null) {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      int loginUserNo = Integer.parseInt(loginUserNoStr);

      // 3. 게시글 삭제 권한 검사
      BoardComment b = boardCommentService.get(commentNo, boardNo);
      if (b == null || b.getWriter().getNo() != loginUserNo) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
      }

      boardCommentService.delete(commentNo, boardNo);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/searchBoards")
  @ResponseBody
  public ResponseEntity searchBoards(
      @RequestParam int category,
      @RequestParam(name = "searchTxt") String keyword,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "5") int pageSize) {
    List<Board> resultList;
//    String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
    try {
      resultList = boardService.searchBoardsList(category, keyword, pageSize, page);
    } catch (Exception e) {
      e.printStackTrace();
      // 예외 발생 시 처리
      return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>(resultList, HttpStatus.OK);
  }


}