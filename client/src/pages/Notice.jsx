import SideMenu from 'common/SideMenu';
import { useState, useEffect, useCallback } from 'react';
import Pagination from 'common/Pagination';
import noneImg from 'image/noneList.svg';

const Notice = () => {
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className='container'>
      <SideMenu />
      {/* <div className='content-wrap notice'>
      </div> */}
    </div>
  );
};

export default Notice;
