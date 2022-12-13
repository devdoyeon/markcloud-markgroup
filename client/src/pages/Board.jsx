import { useState, useEffect } from 'react';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import Pagination from 'common/Pagination';
import ListWrap from 'common/ListWrap';
import { getBoardList } from 'js/groupwareApi';

const Board = () => {
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 9,
  });
  const [filter, setFilter] = useState('writer');
  const [searchText, setSearchText] = useState('');
  const status = !!list?.length;
  let prevent = false;

  const getBoard = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getBoardList(pageInfo, filter, searchText);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setList(data);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    }
  };

  const commonHeaderState = {
    filter,
    setFilter,
    searchText,
    setSearchText,
    status,
  };

  useEffect(() => {
    getBoard();
  }, [pageInfo.page]);

  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
        <CommonHeader {...commonHeaderState} okFn={getBoard} />
        <ListWrap list={list} />
        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
      </div>
    </div>
  );
};

export default Board;
