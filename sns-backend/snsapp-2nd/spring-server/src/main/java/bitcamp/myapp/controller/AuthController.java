package bitcamp.myapp.controller;

import bitcamp.myapp.service.BoardService;
import bitcamp.myapp.service.GuestBookService;
import bitcamp.myapp.service.MemberService;
import bitcamp.myapp.service.MyPageService;
import bitcamp.myapp.service.NcpObjectStorageService;
import bitcamp.myapp.service.RedisService;
import bitcamp.myapp.service.SmsService;
import bitcamp.myapp.vo.LoginUser;
import bitcamp.myapp.vo.Member;
import bitcamp.myapp.vo.MyPage;
import java.util.HashMap;
import java.util.HashSet;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @Autowired
  SmsService smsService;
  @Autowired
  MemberService memberService;
  @Autowired
  BoardService boardService;
  @Autowired
  GuestBookService guestBookService;
  @Autowired
  MyPageService myPageService;
  @Autowired
  NcpObjectStorageService ncpObjectStorageService;
  @Autowired
  RedisService redisService;

  {
    System.out.println("AuthController 생성됨!");
  }

  @GetMapping("test")
  public ResponseEntity test() {
    System.out.println("get 요청 수신@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    return new ResponseEntity<>("통신 성공!", HttpStatus.OK);
  }

  @GetMapping("form")
  public void form(
      @CookieValue(required = false) String phoneNumber,
      HttpSession session,
      Model model) {
    // model.addAttribute("phoneNumber", phoneNumber);
    session.setAttribute("phoneNumber", phoneNumber);
  }

  @GetMapping("add")
  public String add() {
    return "auth/membership";
  }

  @GetMapping("find")
  public String find() {
    return "auth/loginfind";
  }

  @PostMapping("/login")
  public ResponseEntity login(
      @RequestBody Member member,
      HttpServletResponse response) {
    String phoneNumber = member.getPhoneNumber();
    String password = member.getPassword();
    System.out.println(member);
    phoneNumber = phoneNumber.replaceAll("\\D+", "");
    LoginUser loginUserObject = null;
    try {
      // 여기에서 phoneNumber와 password를 사용하여 회원 정보를 검증합니다.
      Member loginUser = memberService.get(phoneNumber, password);

      if (loginUser != null) {
        // 로그인 성공 시 처리
        // 쿠키 설정

        String sessionId = UUID.randomUUID().toString();
        Cookie cookie = new Cookie("sessionId", sessionId);
        cookie.setPath("/");
//        cookie.setHttpOnly(true);
        response.addCookie(cookie);
        cookie.setDomain("bitsns.site");
        response.addCookie(cookie);
        redisService.getValueOps()
            .set(sessionId, Integer.toString(loginUser.getNo()), 1, TimeUnit.DAYS);
        // 세션에 로그인 사용자 정보 저장

        loginUserObject = new LoginUser(loginUser);

        String fcmToken = member.getFcmToken();
        redisService.getValueOps()
            .set("FcmToken:" + loginUser.getNo(), fcmToken, 1, TimeUnit.HOURS);

        HashSet<Member> followMemberSet = new HashSet<>(
            myPageService.followingList(loginUser.getNo()));
        HashSet<Integer> followMemberNoSet = new HashSet<>();
        for (Member m : followMemberSet) {
          followMemberNoSet.add(m.getNo());
        }
        loginUserObject.setFollowMemberSet(followMemberNoSet);

        loginUserObject.setLikeBoardSet(
            new HashSet<>(boardService.likelist(loginUser.getNo())));
        loginUserObject.setLikeGuestBookSet(
            new HashSet<>(guestBookService.likelist(loginUser.getNo())));
        loginUser.setFcmToken(fcmToken);

      } else { // 해당하는 유저가 없을 경우
        return new ResponseEntity<>(null, HttpStatus.NON_AUTHORITATIVE_INFORMATION);
      }
    } catch (Exception e) {
      e.printStackTrace();
      // 예외 발생 시 처리
      return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>(loginUserObject, HttpStatus.OK);
  }

  @GetMapping("/check")
  public ResponseEntity check(
      HttpServletRequest request,
      @CookieValue(value = "sessionId", required = false) Cookie sessionCookie) {

    if (sessionCookie == null) {
      return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    LoginUser loginUserObject = null;
    try {
      String sessionId = sessionCookie.getValue();
      // System.out.println(sessionId);

      // 로컬 레디스가 3.0 버전이라 오류 발생, NCP에서 최신 버전으로 테스트 해볼것
      // String temp = (String) redisService.getValueOps()
      // .getAndExpire(sessionId, 1, TimeUnit.DAYS);
      String temp = (String) redisService.getValueOps().get(sessionId);
      if (temp != null) {
        int loginUserNo = Integer.parseInt(temp);
        loginUserObject = new LoginUser(memberService.get(loginUserNo));

        HashSet<Member> followMemberSet = new HashSet<>(
            myPageService.followingList(loginUserNo));
        HashSet<Integer> followMemberNoSet = new HashSet<>();
        for (Member m : followMemberSet) {
          followMemberNoSet.add(m.getNo());
        }
        loginUserObject.setFollowMemberSet(followMemberNoSet);

        loginUserObject.setLikeBoardSet(
            new HashSet<>(boardService.likelist(loginUserNo)));
        loginUserObject.setLikeGuestBookSet(
            new HashSet<>(guestBookService.likelist(loginUserNo)));

      } else { // 해당하는 유저가 없을 경우
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
      }
    } catch (Exception e) {
      e.printStackTrace();
      // 예외 발생 시 처리
      return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<>(loginUserObject, HttpStatus.OK);
  }

  @GetMapping("logout")
  public String logout(
      HttpServletRequest request,
      HttpServletResponse response,
      @CookieValue(value = "sessionId", required = false) Cookie sessionCookie)
      throws Exception {

    String sessionId = sessionCookie.getValue();

    if (sessionId != null) {
      // 로컬 레디스가 3.0 버전이라 오류 발생, NCP에서 최신 버전으로 테스트 해볼것
      // redisService.getValueOps().getAndDelete(sessionId);
    }

    Cookie cookie = new Cookie("sessionId", "invalidate");
    cookie.setPath("/");
    cookie.setMaxAge(1000);
    response.addCookie(cookie);
    cookie.setDomain("bitsns.site");
    response.addCookie(cookie);

    return null;
  }

  @PostMapping("add")
  public ResponseEntity add(
      @RequestPart("data") Member member,
      @RequestPart("verificationCode") String verificationCode,
      @RequestPart(value = "files", required = false) MultipartFile[] files,
      HttpServletResponse response) throws Exception {

    member.setPhoneNumber(member.getPhoneNumber().replaceAll("\\D+", ""));

    String rand = (String) redisService.getValueOps().get(member.getPhoneNumber());
    if (!verificationCode.equals(rand)) {
      return new ResponseEntity<>("인증 코드가 일치하지 않습니다", HttpStatus.BAD_REQUEST);
    }

    try {
      if (files != null) {
        if (files[0].getSize() > 0) {
          String uploadFileUrl = ncpObjectStorageService.uploadFile(
              "bitcamp-nc7-bucket-14", "sns_member/", files[0]);
          member.setPhoto(uploadFileUrl);
        }
      }

      memberService.add(member);
      MyPage myPage = new MyPage(member);
      myPageService.add(myPage);

      return new ResponseEntity<>(member, HttpStatus.OK);

    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("find")
  public String find(HttpSession session) throws Exception {
    session.invalidate();
    return "auth/loginfind";
  }

  @PostMapping("getPhoneAuthCode")
  @ResponseBody
  public ResponseEntity phoneAuth(@RequestBody HashMap<String, String> bodyMap) {
    String phoneNumber = bodyMap.get("phoneNumber");
    phoneNumber = phoneNumber.replaceAll("\\D+", "");
    try { // 이미 가입된 전화번호가 있으면
      if (bodyMap.get("requestType").equals("resist")
          && smsService.memberTelCount(phoneNumber) > 0) {
        return new ResponseEntity<>("이미 가입된 회원입니다", HttpStatus.OK);
      } else if (bodyMap.get("requestType").equals("findPassword")
          && smsService.memberTelCount(phoneNumber) == 0) {
        return new ResponseEntity<>("가입되지 않은 회원입니다", HttpStatus.OK);
      } else {
        String code = smsService.sendRandomMessage(phoneNumber);
        redisService.getValueOps()
            .set(phoneNumber, code, 3, TimeUnit.MINUTES);
        // 전화 번호에 인증 코드 저장
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return new ResponseEntity<>("3분 안에 인증해주세요", HttpStatus.OK);
  }

  @PostMapping("checkPhoneAuthCode")
  @ResponseBody
  public ResponseEntity phoneAuthOk(
      @RequestBody HashMap<String, String> bodyMap) {
    String phoneNumber = bodyMap.get("phoneNumber");
    String rand = (String) redisService.getValueOps().get(phoneNumber);
    String code = bodyMap.get("verificationCode");

    System.out.println(rand + " : " + code);

    if (rand == null || !rand.equals(code)) {
      return new ResponseEntity<>("인증 코드가 일치하지 않습니다", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
    }

    redisService.getValueOps()
        .set(phoneNumber, code, 15, TimeUnit.MINUTES);
    // 회원 가입 요청 에도 인증을 추가 시 필요
    return new ResponseEntity<>("인증 성공", HttpStatus.OK);
  }

  @PostMapping("phoneFind")
  @ResponseBody
  public Boolean phoneFind(String phoneNumber, HttpSession session) {
    phoneNumber = phoneNumber.replaceAll("\\D+", "");

    try {
      if (smsService.memberTelCountFind(phoneNumber) > 0) {
        return false;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    JSONObject toJson = new JSONObject();

    String code = smsService.sendRandomMessage(phoneNumber);
    session.setAttribute("rand", code);

    return true;
  }


  @PostMapping("/resetPassword")
  @ResponseBody
  public ResponseEntity<String> resetPassword(
      @RequestBody HashMap<String, String> bodyMap) {
    String phoneNumber = bodyMap.get("phoneNumber").replaceAll("\\D+", "");
    String rand = (String) redisService.getValueOps().get(phoneNumber);
    String code = bodyMap.get("verificationCode");

    System.out.println(rand + " : " + code);

    if (rand == null || !rand.equals(code)) {
      return new ResponseEntity<>("인증 코드가 일치하지 않습니다", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
    }

    try {
      // 새로운 비밀번호로 업데이트
      smsService.updatePasswordByPhoneNumber(phoneNumber, bodyMap.get("password"));

      return new ResponseEntity<>("비밀번호 재설정이 완료되었습니다.", HttpStatus.OK);
    } catch (Exception e) {
      e.printStackTrace();
      // 예외 발생 시 처리
      return new ResponseEntity<>("비밀번호 변경 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}