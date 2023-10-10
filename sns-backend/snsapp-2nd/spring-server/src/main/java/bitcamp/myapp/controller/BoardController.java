package bitcamp.myapp.controller;

import bitcamp.myapp.service.BoardCommentService;
import bitcamp.myapp.service.BoardService;
import bitcamp.myapp.service.NcpObjectStorageService;
import bitcamp.myapp.vo.Board;
import bitcamp.myapp.vo.BoardComment;
import bitcamp.myapp.vo.BoardPhoto;
import bitcamp.myapp.vo.LoginUser;
import bitcamp.myapp.vo.Member;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.MatrixVariable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/board")
public class BoardController {

  @Autowired
  BoardService boardService;
  @Autowired
  BoardCommentService boardCommentService;
  @Autowired
  NcpObjectStorageService ncpObjectStorageService;

  {
    System.out.println("BoardController 생성됨!");
  }

  @GetMapping("form")
  public void form() throws Exception {
  }

  @PostMapping("add")
  public String add(@RequestBody Board board, MultipartFile[] files, HttpSession session) throws Exception {
    Member loginUser = (Member) session.getAttribute("loginUser");
    if (loginUser == null) {
      return "redirect:/auth/form";
    }
    board.setWriter(loginUser);

    ArrayList<BoardPhoto> attachedFiles = new ArrayList<>();
    for (MultipartFile part : files) {
      if (part.getSize() > 0) {
        String uploadFileUrl = ncpObjectStorageService.uploadFile(
            "bitcamp-nc7-bucket-14", "sns_board/", part);
        BoardPhoto attachedFile = new BoardPhoto();
        attachedFile.setFilePath(uploadFileUrl);
        attachedFiles.add(attachedFile);
      }
    }
    board.setAttachedFiles(attachedFiles);

    boardService.add(board);
    return "redirect:/board/list?category=" + board.getCategory();
  }

  @GetMapping("delete")
  public String delete(int no, int category, HttpSession session) throws Exception {
    Member loginUser = (Member) session.getAttribute("loginUser");
    if (loginUser == null) {
      return "redirect:/auth/form";
    }

    System.out.println(no);
    Board b = boardService.get(no);

    if (b == null || b.getWriter().getNo() != loginUser.getNo()) {
      throw new Exception("해당 번호의 게시글이 없거나 삭제 권한이 없습니다.");
    } else {
      boardService.delete(b.getNo());
      return "redirect:/board/list?category=" + category;
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
  public List<Board> list(@RequestParam int category,
      @RequestParam(defaultValue = "") String keyword,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int pageSize,
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

    model.addAttribute("boardList", boardList);
    model.addAttribute("maxPage", (totalRecords + (pageSize - 1)) / pageSize);
    model.addAttribute("page", page);
    model.addAttribute("pageSize", pageSize);
    model.addAttribute("category", category);

    if (category == 1) {
      return boardList; // 카테고리가 1일 때 "list.html"을 실행

    } else {
      throw new Exception("유효하지 않은 카테고리입니다.");
    }
  }

  @PostMapping("list/{category}")
  public String searchBoards(@PathVariable int category,
      @RequestParam("keyword") String keyword,
      @RequestParam(defaultValue = "1") int page) throws Exception {
    String encodedKeyword = URLEncoder.encode(keyword, "UTF-8");
    String queryString = String.format("&keyword=%s&page=%d", encodedKeyword, page);
    return "redirect:/board/list?category=" + category + queryString;
  }

  @PostMapping("update")
  public String update(Board board, MultipartFile[] files, HttpSession session) throws Exception {
    Member loginUser = (Member) session.getAttribute("loginUser");
    if (loginUser == null) {
      return "redirect:/auth/form";
    }

    Board b = boardService.get(board.getNo());
    if (b == null || b.getWriter().getNo() != loginUser.getNo()) {
      throw new Exception("게시글이 존재하지 않거나 변경 권한이 없습니다.");
    }

    ArrayList<BoardPhoto> attachedFiles = new ArrayList<>();
    for (MultipartFile part : files) {
      if (part.getSize() > 0) {
        String uploadFileUrl = ncpObjectStorageService.uploadFile(
            "bitcamp-nc7-bucket-14", "sns_board/", part);
        BoardPhoto attachedFile = new BoardPhoto();
        attachedFile.setFilePath(uploadFileUrl);
        attachedFiles.add(attachedFile);
      }
    }
    board.setAttachedFiles(attachedFiles);

    boardService.update(board);
    return "redirect:/board/detail/" + board.getCategory() + "/" + board.getNo();
  }


  @GetMapping("fileDelete/{attachedFile}") // 예) .../fileDelete/attachedfile;no=30
  public String fileDelete(@MatrixVariable("no") int no, HttpSession session) throws Exception {
    Member loginUser = (Member) session.getAttribute("loginUser");
    if (loginUser == null) {
      return "redirect:/auth/form";
    }

    Board board = null;
    BoardPhoto attachedFile = boardService.getAttachedFile(no);
    board = boardService.get(attachedFile.getBoardNo());
    if (board.getWriter().getNo() != loginUser.getNo()) {
      throw new Exception("게시글 변경 권한이 없습니다!");
    }

    if (boardService.deleteAttachedFile(no) == 0) {
      throw new Exception("해당 번호의 첨부파일이 없습니다.");
    } else {
      return "redirect:/board/detail/" + board.getCategory() + "/" + board.getNo();
    }
  }

  // 좋아요 기능
  @PostMapping("like")
  public int like(@RequestParam int boardNo, HttpSession session) throws Exception {
    LoginUser loginUser = (LoginUser) session.getAttribute("loginUser");
    try {
      Board board = boardService.get(boardNo);
      boardService.like(loginUser, board);
      loginUser.getLikeBoardSet().add(boardNo);
      session.setAttribute("loginUser", loginUser);
      return 1; // 예: 성공시 1 반환
    } catch (Exception e) {
      return -1;
    }
  }

  @PostMapping("unlike")
  public int unlike(@RequestParam int boardNo, HttpSession session) throws Exception {
    LoginUser loginUser = (LoginUser) session.getAttribute("loginUser");
    try {
      Board board = boardService.get(boardNo);
      boardService.unlike(loginUser, board);
      loginUser.getLikeBoardSet().remove(boardNo);
      session.setAttribute("loginUser", loginUser);
      return 1; // 예: 성공시 1 반환
    } catch (Exception e) {
      return -1;
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
  public String addComment(
      BoardComment boardComment,
      HttpSession session,
      @RequestParam("boardNo") int boardNo) throws Exception {
    Member loginUser = (LoginUser) session.getAttribute("loginUser");
    if (loginUser == null) {
      return "redirect:/auth/form";
    }

    boardComment.setBoardNo(boardNo);
    boardComment.setWriter(loginUser);

    boardCommentService.add(boardComment);
    return "redirect:/board/detail/1/" + boardComment.getBoardNo();
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

  @GetMapping("deleteComment/{boardNo}/{no}")
  public String deleteComment(@PathVariable int no, @PathVariable int boardNo, HttpSession session)
      throws Exception {
    Member loginUser = (Member) session.getAttribute("loginUser");
    if (loginUser == null) {
      return "redirect:/auth/form";
    }

    BoardComment b = boardCommentService.get(no, boardNo);

    if (b == null || b.getWriter().getNo() != loginUser.getNo()) {
      throw new Exception("해당 번호의 게시글이 없거나 삭제 권한이 없습니다.");
    } else {
      boardCommentService.delete(no, boardNo);
      return "redirect:/board/detail/1/" + boardNo;
    }
  }
}