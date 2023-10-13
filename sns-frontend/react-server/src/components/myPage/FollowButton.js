import styled from 'styled-components';

const StyledFollowButton = styled.button`
  margin-top: 25px;
  color: #426b1f;
  background-color: transparent;
`;

const FollowButton = ({
  followMemberSet,
  memberNo,
  handleUnfollow,
  handleFollow,
}) => {
  return (
    <>
      {followMemberSet.includes(memberNo) ? (
        <StyledFollowButton onClick={() => handleUnfollow(memberNo)}>
          팔로잉 취소
        </StyledFollowButton>
      ) : (
        <StyledFollowButton onClick={() => handleFollow(memberNo)}>
          팔로우 하기
        </StyledFollowButton>
      )}
    </>
  );
};

export default FollowButton;