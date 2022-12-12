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
      <div className='content-wrap notice'>Notice</div>
    </div>
  );
};

export default Notice;
