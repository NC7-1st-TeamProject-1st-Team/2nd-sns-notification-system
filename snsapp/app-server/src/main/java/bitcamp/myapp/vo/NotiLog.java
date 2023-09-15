package bitcamp.myapp.vo;

import java.io.Serializable;
import java.util.Objects;

public class NotiLog implements Serializable {

    private static final long serialVersionUID = 1L;

    private int no; // 알림 기록 번호
    private int memberNo; // 회원 번호
    private int notiNo; //알림 번호
    private String content;
    private String url;
    private String noti_State;

    @Override
    public String toString() {
        return "NotiLog{" +
                "no=" + no +
                ", memberNo=" + memberNo +
                ", notiNo=" + notiNo +
                ", content='" + content + '\'' +
                ", url='" + url + '\'' +
                ", noti_State='" + noti_State + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NotiLog notiLog)) return false;
        return no == notiLog.no && memberNo == notiLog.memberNo && notiNo == notiLog.notiNo && Objects.equals(content, notiLog.content) && Objects.equals(url, notiLog.url) && Objects.equals(noti_State, notiLog.noti_State);
    }

    @Override
    public int hashCode() {
        return Objects.hash(no, memberNo, notiNo, content, url, noti_State);
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public int getMemberNo() {
        return memberNo;
    }

    public void setMemberNo(int memberNo) {
        this.memberNo = memberNo;
    }

    public int getNotiNo() {
        return notiNo;
    }

    public void setNotiNo(int notiNo) {
        this.notiNo = notiNo;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNoti_State() {
        return noti_State;
    }

    public void setNoti_State(String noti_State) {
        this.noti_State = noti_State;
    }
}
