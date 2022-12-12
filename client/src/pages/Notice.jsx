import SideMenu from 'common/SideMenu';
import { useState, useEffect, useCallback } from 'react';
import Pagination from 'common/Pagination';
import noneImg from 'image/noneList.svg';
import NewBoard from '../common/NewBoard';

const Notice = () => {
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className='container'>
      <SideMenu />
      <NewBoard />
      {/* <div className='content-wrap notice'>
      </div> */}
    </div>
  );
};

export default Notice;
