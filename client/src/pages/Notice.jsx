import SideMenu from 'common/SideMenu';
import { useState, useEffect } from 'react';
import Pagination from 'common/Pagination';
import CommonHeader from 'common/CommonHeader';
import ListWrap from 'common/ListWrap';
import { getNoticeList } from 'js/groupwareApi';

const Notice = () => {
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 9,
  });
  const [filter, setFilter] = useState('created_id');
  const [searchText, setSearchText] = useState('');
  const status = !!list?.length;
  let prevent = false;

  const getNoticeApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getNoticeList(pageInfo, filter, searchText);
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
    getNoticeApi();
  }, [pageInfo.page]);
  console.log(list.length === true);
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap notice'>
        <CommonHeader {...commonHeaderState} okFn={getNoticeApi} />
        <ListWrap list={list} />
        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
      </div>
    </div>
  );
};

export default Notice;
