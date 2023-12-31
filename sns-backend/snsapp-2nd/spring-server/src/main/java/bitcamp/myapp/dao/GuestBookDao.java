package bitcamp.myapp.dao;

import bitcamp.myapp.vo.GuestBook;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface GuestBookDao {

  int insert(GuestBook guestBook);

  List<GuestBook> findAll(
      @Param("no") int no,
      @Param("limit") int limit,
      @Param("offset") int offset);

  GuestBook findBy(int no);

  int delete(int no);

  int getTotalCount(int mpno);

  int updateLike(int guestBookNo); // 좋아요 수 1 증가

  int cancelLike(int guestBookNo); // 좋아요 수 1 감소

  int insertLike(
      @Param("memberNo") int memberNo,
      @Param("guestBookNo") int guestBookNo); // 좋아요 테이블에 추가

  int deleteLike(
      @Param("memberNo") int memberNo,
      @Param("guestBookNo") int guestBookNo); // 좋아요 테이블에 삭제

  int deleteLikes(int guestBookNo); // 게시판 삭제시 좋아요도 삭제

  List<Integer> findLikeByMno(int memberNo);

  List<String> findLikeByBno(int guestBookNo);

  // nick 값을 가져오기 위한 쿼리 추가
  String findNickByMpno(int no); // 회원 고유 번호를 사용하여 nick 값을 가져옴
}