import SideMenu from 'common/SideMenu';
import { useState, useEffect, useCallback } from 'react';
import Pagination from 'common/Pagination';
import noneImg from 'image/noneList.svg';

const Notice = () => {
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  //공지사항 리스트 조회 함수
  // const getList = useCallback(async () => {
  //   const listData = await getNoticeList(currentPage);
  //   if (typeof listData === 'object') {
  //     const { data, meta } = listData?.data;
  //     setList(data);
  //     setPageInfo(meta);
  //   } else
  //     catchErrorHandler(
  //       listData,
  //       dispatch,
  //       () => {
  //         getList();
  //       },
  //       'c',
  //       () => {},
  //       () => {}
  //     );
  // }, [currentPage, dispatch]);

  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap notice'>
        <div className='header'>
          <h3>공지사항</h3>
        </div>
        <div className='list-wrap'>
          {/* 리스트는 게시판에다가 다 구현해 뒀고 게시글 없는 건 이쪽에 테스트 하겠습니다!!
          Board.jsx 가시면 반복문 구현해 둔 리스트 있는데 클래스명 참고하세요~ */}
          <div className='noneList column'>
            <img src={noneImg} alt='글 없음 아이콘' />
            <span>등록된 게시글이 없습니다.</span>
          </div>
          <div className='btn-wrap'>
            <button className='commonBtn noticeBtn'>등록</button>
          </div>
          {/* <Pagination
          postsPerPage={pageInfo.limit}
          viewPageNum={5}
          totalPosts={pageInfo.totalCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        /> */}
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
  );
};

export default Notice;
