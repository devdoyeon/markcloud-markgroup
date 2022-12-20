import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import Pagination from 'common/Pagination';
import ListWrap from 'common/ListWrap';
import CommonModal from 'common/CommonModal';
import { getBoardList } from 'js/groupwareApi';
import { catchError, changeTitle } from 'js/commonUtils';

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
    totalPage: 9,
    limit: 9,
  });
  const [filter, setFilter] = useState('created_id');
  const [searchText, setSearchText] = useState('');
  let prevent = false;
  const navigate = useNavigate();

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
    changeTitle('그룹웨어 > 게시판');
  }, []);

  useEffect(() => {
    getBoard();
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
            if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
          }}
        />
      )}
    </>
  );
};

export default Board;
