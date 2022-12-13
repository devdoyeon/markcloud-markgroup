import SideMenu from 'common/SideMenu';
import { useState, useEffect } from 'react';
import Pagination from 'common/Pagination';
import CommonHeader from 'common/CommonHeader';
import ListWrap from 'common/ListWrap';
import { noticeList } from 'js/groupwareApi';
import useInput from 'Hooks/useInput';

const Notice = () => {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 60,
  });
  const status = !!list?.length;

  const noticeApi = async (filter, filter_val, pageInfo) => {
    const result = await noticeList(filter, filter_val, pageInfo);
    const { data, meta } = result?.data;
    setList(data);
    setPageInfo(prev => {
      const clone = { ...prev };
      clone.page = meta.page;
      clone.totalPage = meta.totalPage;
      return clone;
    });
    return result;
  };

  useEffect(() => {
    noticeApi(filter, searchText, pageInfo.page);
  }, []);

  useEffect(() => {}, [searchText, filter]);
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap notice'>
        <CommonHeader
          filter={filter}
          setFilter={setFilter}
          searchText={searchText}
          setSearchText={setSearchText}
          status={status}
        />
        <ListWrap />
        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
      </div>
    </div>
  );
};

export default Notice;
