import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';
import CommonHeader from 'common/CommonHeader';
import CommonModal from 'common/CommonModal';
import ListWrap from 'common/ListWrap';
import { getReportList } from 'js/groupwareApi';
import { catchError, changeTitle } from 'js/commonUtils';
import { getCookie } from 'js/cookie';

const Report = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 0,
    limit: 9,
  });
  const [filter, setFilter] = useState('created_id');
  const [searchText, setSearchText] = useState('');
  let prevent = false;
  const navigate = useNavigate;

  //= 주간 업무 보고 리스트 불러오기
  const getReport = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getReportList(pageInfo, filter, searchText);
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
    if (getCookie('myToken')) changeTitle('그룹웨어 > 주간 업무 보고');
  }, []);

  useEffect(() => {
    if (getCookie('myToken')) getReport();
  }, [pageInfo.page]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap notice'>
          <CommonHeader {...commonHeaderState} okFn={getReport} />
          <ListWrap list={list} />
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
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
        />
      )}
    </>
  );
};

export default Report;
