import { memo } from 'react';

const CommonPagination = memo(
  ({ postsPerPage, viewPageNum, totalPosts, currentPage, setCurrentPage }) => {
    //페이지 바꾸기
    const chagePage = (type, curPage, lastPage) => {
      if (type === 'prev') {
        if (curPage === 1) return;
        setCurrentPage(curPage - 1);
      } else {
        if (curPage === lastPage) return;
        setCurrentPage(curPage + 1);
      }
    };
    const renderPage = () => {
      //전체게시글이 화면에 그려질 게시글 수보다 적거나 값이 없으면 페이지네이션 X
      if (totalPosts <= postsPerPage || !totalPosts || !postsPerPage) return;
      //전체페이지
      const totalPage = Math.ceil(totalPosts / postsPerPage);
      //페이지 그룹
      const pageGroup = Math.ceil(currentPage / viewPageNum);
      //각 페이지네이션의 마지막 번호
      let last = pageGroup * viewPageNum;
      if (last > totalPage) last = totalPage;
      let first = last - (viewPageNum - 1) <= 0 ? 1 : last - (viewPageNum - 1);
      //페이지 번호 담는 배열
      const pageNumber = [];
      for (let i = first; i <= last; i++) {
        pageNumber.push(i);
      }
      return (
        <>
          <li
            className={currentPage === 1 ? 'disabled' : ''}
            onClick={() => chagePage('prev', currentPage, totalPage)}>
            <i className='fas fa-chevron-left'></i>
          </li>
          {pageNumber.map(num => {
            return (
              <li
                key={num}
                className={num === currentPage ? 'active' : ''}
                onClick={() => {
                  setCurrentPage(num);
                }}>
                {num}
              </li>
            );
          })}
          <li
            className={currentPage === totalPage ? 'disabled' : ''}
            onClick={() => chagePage('next', currentPage, totalPage)}>
            <i className='fas fa-chevron-right'></i>
          </li>
        </>
      );
    };
    return (
      <div className='pagination-box'>
        <ul>{renderPage()}</ul>
      </div>
    );
  }
);

export default CommonPagination;
