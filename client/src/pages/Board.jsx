import { useState } from 'react';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import Pagination from 'common/Pagination';
import ListWrap from 'common/ListWrap';

const Board = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 15,
  });

  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
        <CommonHeader header={'자유게시판'} />
        <ListWrap />
        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
      </div>
    </div>
  );
};

export default Board;
