import SideMenu from 'common/SideMenu';
import { useState, useEffect, useCallback } from 'react';
import CommonPagination from 'common/CommonPagination';

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
          <ul>
            <li>
              <div className='date-wrap'>
                <span>2022.10.25</span>
              </div>
            </li>
            <li>d</li>
            <li>d</li>
            <li>d</li>
            <li>d</li>
            <li>d</li>
            <li>d</li>
            <li>d</li>
            <li>d</li>
          </ul>
          <div className='btn-wrap'>
            <button className='commonBtn noticeBtn'>등록</button>
          </div>
          {/* <CommonPagination
          postsPerPage={pageInfo.limit}
          viewPageNum={5}
          totalPosts={pageInfo.totalCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        /> */}
          <CommonPagination />
        </div>
      </div>
    </div>
  );
};

export default Notice;
