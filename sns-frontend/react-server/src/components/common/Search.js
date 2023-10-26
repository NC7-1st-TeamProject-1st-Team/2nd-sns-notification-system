import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #426b1f;
  color: white;
  padding: 5px 10px;
  text-decoration: none;
  border: none; // 테두리 제거
  border-radius: 4px;
  margin-right: ${(props) =>
    props.main ? '300px' : props.write ? '10px' : '0'};
  &:hover {
    background-color: #426b1f;
  }
`;
const SearchLabel = styled.p`
  display: flex;
  align-items: center;
  gap: 10px; // 아이템 사이의 간격
`;

const SearchBox = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const SearchInput = styled.input`
  padding: 5px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  margin-left: 20px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const SearchButton = styled(Button)`
  margin-right: 10px;
  pointer: cursor;
  &:hover {
    cursor: pointer;
    background-color: #5d962c;
  }
`;

const Search = ({
  title,
  category,
  searchTxt,
  onSubmitSearch,
  placeholder,
  onChange,
}) => {
  return (
    <SearchBox>
      <SearchLabel>
        {title}
        <SearchInput
          type="text"
          name="searchTxt"
          value={searchTxt}
          placeholder={placeholder}
          onChange={onChange}
        />
        <SearchButton type="submit" onClick={onSubmitSearch}>
          검색
        </SearchButton>
      </SearchLabel>
    </SearchBox>
  );
};

export default Search;
