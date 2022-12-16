import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';
import CommonHeader from 'common/CommonHeader';
import ListWrap from 'common/ListWrap';
import CommonModal from 'common/CommonModal';
import { getNoticeList } from 'js/groupwareApi';
import { catchError, changeTitle } from 'js/commonUtils';

const Notice = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 9,
  });
  const [filter, setFilter] = useState('created_id');
  const [searchText, setSearchText] = useState('');
  let prevent = false;
  const navigate = useNavigate();

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
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const commonHeaderState = {
    filter,
    setFilter,
    searchText,
    setSearchText,
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 공지사항');
  }, []);

  useEffect(() => {
    getNoticeApi();
  }, [pageInfo.page]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap notice'>
          <CommonHeader {...commonHeaderState} okFn={getNoticeApi} />
          <ListWrap list={list} />
          {list.length > 0 && (
            <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
          )}
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default Notice;
