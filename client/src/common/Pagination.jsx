import { useState, useEffect } from 'react';
import activeNextPage from 'image/nextPageActive.svg';
import activePrevPage from 'image/prevPageActive.svg';
import nextPage from 'image/nextPage.svg';
import prevPage from 'image/prevPage.svg';
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
    let first =
      p % 10 === 0
        ? p - 9
        : parseInt(p / 10) === 0
        ? 1
        : parseInt(p / 10) * 10 + 1;
    let last =
      p % 10 === 0
        ? p
        : parseInt(p / 10) === 0
        ? 10
        : parseInt(p / 10) * 10 + 10 > totalPage
        ? totalPage
        : parseInt(p / 10) * 10 + 10;
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
    changePage(
      direction === 'prev'
        ? page - 10
        : page + 10 > totalPage
        ? totalPage
        : page + 10
    );
  };

  useEffect(() => {
    changePageGroup(page);
  }, [pageInfo]);

  const renderPagination = () => {
    const prevCheck = page >= 11;
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
    const nextCheck =
      totalPage >= 11 ? (pageGroup.includes(totalPage) ? false : true) : false;
    return (
      <>
        <li
          onClick={() => changePara(prevCheck ? 'prev' : null)}
          className={`prev ${prevCheck ? 'active' : 'block'}`}>
          <img src={prevCheck ? activePrevPage : prevPage} alt='이전 버튼' />
        </li>
        {middle}
        <li
          onClick={() => changePara(nextCheck ? 'next' : null)}
          className={`next ${nextCheck ? 'active' : 'block'}`}>
          <img src={nextCheck ? activeNextPage : nextPage} alt='다음 버튼' />
        </li>
      </>
    );
  };
  console.log(pageInfo);
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
