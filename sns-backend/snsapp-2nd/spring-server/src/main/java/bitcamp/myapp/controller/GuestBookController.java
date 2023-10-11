package bitcamp.myapp.controller;

import bitcamp.myapp.service.GuestBookService;
import bitcamp.myapp.service.MyPageService;
import bitcamp.myapp.vo.Board;
import bitcamp.myapp.vo.GuestBook;
import bitcamp.myapp.vo.LoginUser;
import bitcamp.myapp.vo.Member;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/guestBook")
public class GuestBookController {

  @Autowired
  GuestBookService guestBookService;

  @Autowired
  MyPageService myPageService;

  {
    System.out.println("GuestBookController 생성됨!");
  }

  @GetMapping("form")
  public void form() throws Exception {
  }

  @PostMapping("add")
  public ResponseEntity add(@RequestBody GuestBook guestBook, HttpSession session)
      throws Exception {
    System.out.println(guestBook);
    try {
      guestBookService.add(guestBook);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return new ResponseEntity<>(guestBook, HttpStatus.OK);
  }

  @DeleteMapping("delete/{guestBookNo}")
  public ResponseEntity delete(@PathVariable int guestBookNo, HttpSession session)
      throws Exception {
//    Member loginUser = (Member) session.getAttribute("loginUser");
//    if (loginUser == null) {
//      return new ResponseEntity<>("not exist writer", HttpStatus.BAD_REQUEST);
//    }

    GuestBook g = guestBookService.get(guestBookNo);

//    if (g == null || g.getWriter().getNo() != loginUser.getNo()) {
//      throw new Exception("해당 번호의 게시글이 없거나 삭제 권한이 없습니다.");
//    } else {
    guestBookService.delete(g.getNo());
    return new ResponseEntity<>(HttpStatus.OK);
//    }
  }

  @GetMapping("{no}")
  public ResponseEntity<Map<String, Object>> list(
      @PathVariable int no,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int pageSize,
      Model model, HttpSession session) throws Exception {
    int totalRecords;

    List<GuestBook> guestBookList = guestBookService.list(no, pageSize, page);
    totalRecords = guestBookService.getTotalCount(no);

//    model.addAttribute("guestBookList", guestBookList);
//    model.addAttribute("maxPage", (totalRecords + (pageSize - 1)) / pageSize);
//    model.addAttribute("page", page);
//    model.addAttribute("pageSize", pageSize);

    // 이 부분에서 회원의 닉네임을 가져와서 모델에 추가
    String guestBookOwnerNick = guestBookService.getMemberNickByNo(no);
//    model.addAttribute("guestBookOwnerNick", guestBookOwnerNick);
//
//    model.addAttribute("mpno", no);

    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put("guestBookList", guestBookList);
    resultMap.put("guestBookOwnerNick", guestBookOwnerNick);

    return new ResponseEntity<>(resultMap, HttpStatus.OK);
  }

  // 좋아요 기능
  @PostMapping("like")
  public int like(@RequestParam int guestBookNo, HttpSession session) throws Exception {
    LoginUser loginUser = (LoginUser) session.getAttribute("loginUser");
    try {
      GuestBook guestBook = guestBookService.get(guestBookNo);
      guestBookService.like(loginUser, guestBook);
      loginUser.getLikedGuestBookSet().add(guestBookNo);
      session.setAttribute("loginUser", loginUser);
      return 1; // 예: 성공시 1 반환
    } catch (Exception e) {
      return -1;
    }
  }

  @PostMapping("unlike")
  public int unlike(@RequestParam int guestBookNo, HttpSession session) throws Exception {
    LoginUser loginUser = (LoginUser) session.getAttribute("loginUser");
    try {
      GuestBook guestBook = guestBookService.get(guestBookNo);
      guestBookService.unlike(loginUser, guestBook);
      loginUser.getLikedGuestBookSet().remove(guestBookNo);
      session.setAttribute("loginUser", loginUser);
      return 1; // 예: 성공시 1 반환
    } catch (Exception e) {
      return -1;
    }
  }

  @GetMapping("/likedGuestBooks")
  public ResponseEntity<List<Integer>> getLikedGuestBooks(HttpSession session) {
    try {
      Member loginUser = (Member) session.getAttribute("loginUser");
      if (loginUser == null) {
        // 로그인되지 않은 경우
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      List<Integer> likedGuestBooks = guestBookService.likelist(loginUser.getNo());
      return new ResponseEntity<>(likedGuestBooks, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}