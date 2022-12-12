import { useState, useEffect } from 'react';
// import activeNextPage from 'image/nextPageActive.svg'
import activePrevPage from 'image/prevPageActive.svg'
import nextPage from 'image/nextPage.svg'
import prevPage from 'image/prevPage.svg'
import { changeState } from 'js/commonUtils';

//= 페이지네이션 적용 시 스타일 수정 필요

const Pagination = ({ pageInfo, setPageInfo }) => {
  const [pageGroup, setPageGroup] = useState([]);
  const { totalPage, page } = pageInfo;

  // 부모컴포넌트의 종류에 따라 페이지 변경 함수가 달리 작용 됨
  const changePage = p => {
    if (page === p) return;
    else changeState(setPageInfo, 'page', p);
  };
  // 페이지 그룹 다르게 보이게 함
  const changePageGroup = p => {
    const arr = [];
    let first = p - 4;
    let last = p + 4;
    // 현재 페이지가 5보다 작을 때
    if (p <= 5) {
      first = 1;
      last = 9;
    }
    // 현재 페이지가 totalPage에서 4를 뺀 값보다 크거나 같을 때
    if (p >= totalPage - 4) {
      first = totalPage - 8;
      last = totalPage;
    }
    // totalPage가 10보다 작을 때
    if (totalPage < 10) {
      first = 1;
      last = totalPage;
    }
    for (let i = first; i < last + 1; i++) {
      arr.push(i);
    }
    setPageGroup(arr);
  };
  // 페이지를 입력하여 이동할 때 사용 하는 함수
  const changePara = direction => {
    if (!direction) return;
    changePage(direction === 'prev' ? page - 1 : page + 1);
  };

  useEffect(() => {
    changePageGroup(page);
  }, [pageInfo]);

  const renderPagination = () => {
    const prevCheck = page > 1;
    const middle = pageGroup.reduce((acc, nowPage) => {
      return (
        <>
          {acc}
          <li
            onClick={() => changePage(nowPage)}
            className={nowPage === page ? 'now' : ''}>
            {nowPage}
          </li>
        </>
      );
    }, <></>);
    const nextCheck = page < totalPage;
    return (
      <>
        <li
          onClick={() => changePara(prevCheck ? 'prev' : null)}
          className={`prev ${page === 1 ? 'block' : 'active'}`}>
            {/* <img src={page === 1 ? prevPage : activePrevPage} alt="이전 버튼" /> */}
        </li>
        {middle}
        <li
          onClick={() => changePara(nextCheck ? 'next' : null)}
          className={`next ${totalPage === page ? 'block' : 'active'}`}>
            {/* <img src={totalPage === page ? nextPage : activeNextPage} alt="다음 버튼" /> */}
        </li>
      </>
    );
  };
  return (
    <>
      {pageInfo.totalPage > 1 ? (
        <ul className='pagination row'>{renderPagination()}</ul>
      ) : (
        ''
      )}
    </>
  );
};

export default Pagination;
