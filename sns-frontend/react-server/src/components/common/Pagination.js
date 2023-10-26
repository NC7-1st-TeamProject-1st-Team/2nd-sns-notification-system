import styled from 'styled-components';
import Button from '../common/Button';
import qs from 'qs';
import { Link, useLocation } from 'react-router-dom';

const Spacer = styled.div`
  height: 1rem;
`;

const PaginationLink = styled(Link)`
  display: inline-block;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  margin-right: 4px;
  border-radius: 50%;
  background-color: #fafaf5;
  text-decoration: none;
  color: black;

  &.pagination-link-active {
    background-color: #426b1f;
    color: white;
  }
`;

const PageLabel = styled.div`
  margin-top: 60px;
  text-align: center;
`;

const buildLink = ({ location, query, page }) => {
  const makeQuery = qs.stringify({ ...query, page });
  return `${location.pathname}?${makeQuery}`;
};

const Pagination = ({ page, lastPage, query }) => {
  const location = useLocation();

  //페이지네이션 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <PageLabel>
        {page <= 1 ? null : (
          <PaginationLink
            to={
              page === 1
                ? undefined
                : buildLink({
                    location,
                    query,
                    page: 1,
                  })
            }
            className={page === 1 ? 'pagination-link-active' : ''}
            onClick={scrollToTop}
          >
            {1}
          </PaginationLink>
        )}
        {page <= 2 ? null : (
          <PaginationLink
            to={
              page === page - 1
                ? undefined
                : buildLink({
                    location,
                    query,
                    page: parseInt(page) - 1,
                  })
            }
            className={page === page - 1 ? 'pagination-link-active' : ''}
            onClick={scrollToTop}
          >
            {page - 1}
          </PaginationLink>
        )}
        <PaginationLink
          to={buildLink({
            location,
            query,
            page,
          })}
          className="pagination-link-active"
          onClick={scrollToTop}
        >
          {page}
        </PaginationLink>
        {page >= lastPage - 1 ? null : (
          <PaginationLink
            to={
              page === lastPage - 1
                ? undefined
                : buildLink({
                    location,
                    query,
                    page: parseInt(page) + 1,
                  })
            }
            className={page === lastPage - 1 ? 'pagination-link-active' : ''}
            onClick={scrollToTop}
          >
            {parseInt(page) + 1}
          </PaginationLink>
        )}
        {parseInt(page) >= parseInt(lastPage) ? null : (
          <PaginationLink
            to={
              page === lastPage
                ? undefined
                : buildLink({
                    location,
                    query,
                    page: lastPage,
                  })
            }
            className={page === lastPage ? 'pagination-link-active' : ''}
            onClick={scrollToTop}
          >
            {lastPage}
          </PaginationLink>
        )}
      </PageLabel>
      <Spacer />
    </>
  );
};
export default Pagination;
