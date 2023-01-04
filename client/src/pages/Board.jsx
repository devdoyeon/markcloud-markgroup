import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import Pagination from 'common/Pagination';
import ListWrap from 'common/ListWrap';
import CommonModal from 'common/CommonModal';
import { getBoardList } from 'js/groupwareApi';
import { catchError, changeTitle } from 'js/commonUtils';
import { getCookie, removeCookie } from 'js/cookie';

const Board = () => {
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
  const navigate = useNavigate();

  //= 사내 게시판 리스트 불러오기
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
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const commonHeaderState = {
    filter,
    setFilter,
    searchText,
    setSearchText,
  };

  useEffect(() => {
    if (getCookie('myToken')) changeTitle('그룹웨어 > 게시판');
  }, []);

  useEffect(() => {
    if (getCookie('myToken')) getBoard();
  }, [pageInfo.page]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap'>
          <CommonHeader {...commonHeaderState} okFn={getBoard} />
          <ListWrap list={list} />
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'duplicateLogin') return navigate('/gp/sign-in');
            else if (alert === 'tokenExpired') {
              removeCookie('myToken');
              removeCookie('rfToken');
              navigate('/gp/');
            } else return;
          }}
        />
      )}
    </>
  );
};

export default Board;
