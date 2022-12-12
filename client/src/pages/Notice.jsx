import SideMenu from 'common/SideMenu';
import { useState, useEffect } from 'react';
import Pagination from 'common/Pagination';
import CommonHeader from 'common/CommonHeader';
import ListWrap from 'common/ListWrap';

const Notice = () => {
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 60,
  });

  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap notice'>
        <CommonHeader header='공지사항' />
        <ListWrap />
        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
      </div>
    </div>
  );
};

export default Notice;
