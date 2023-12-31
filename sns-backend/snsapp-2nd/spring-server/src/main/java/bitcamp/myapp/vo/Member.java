package bitcamp.myapp.vo;

import java.io.Serializable;
import java.util.Objects;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@EntityScan
public class Member implements Serializable {

  private static final long serialVersionUID = 1L;

  private int no; // 회원번호
  private String nick; // 닉네임
  private String name; // 이름
  private String phoneNumber; // 전화번호
  private String email; // 이메일
  private String password; // 비밀번호
  private String photo; // 프로필 사진
  private String fcmToken;


  @Override
  public String toString() {
    return "Member{" +
        "no=" + no +
        ", nick='" + nick + '\'' +
        ", name='" + name + '\'' +
        ", phoneNumber='" + phoneNumber + '\'' +
        ", email='" + email + '\'' +
        ", password='" + password + '\'' +
        ", photo='" + photo + '\'' +
        ", fcmToken='" + fcmToken + '\'' +
        '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof Member member)) {
      return false;
    }
    return this.no == member.no;
  }

  @Override
  public int hashCode() {
    return Objects.hash(no);
  }

  public int getNo() {
    return no;
  }

  public void setNo(int no) {
    this.no = no;
  }

  public String getNick() {
    return nick;
  }

  public void setNick(String nick) {
    this.nick = nick;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhoto() {
    return photo;
  }

  public void setPhoto(String photo) {
    this.photo = photo;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getFcmToken() {
    return fcmToken;
  }

  public void setFcmToken(String fcmToken) {
    this.fcmToken = fcmToken;
  }
}
