import { useState, useEffect } from 'react';
import SideMenu from 'common/SideMenu';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CommonModal from 'common/CommonModal';
import { catchError, changeTitle } from 'js/commonUtils';
import {
  getBoardDetail,
  getNoticeInfo,
  getReportDetail,
} from 'js/groupwareApi';
import { getCookie } from 'js/cookie';

const BoardRead = () => {
  const path = useLocation().pathname;
  let prevent = false;
  const navigate = useNavigate();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const { id } = useParams();
  const [header, setHeader] = useState('');
  const [info, setInfo] = useState({});

  //= 상세내역 불러오기
  const getDetail = async () => {
    if (prevent) return;
    prevent = false;
    setTimeout(() => {
      prevent = true;
    }, 200);
    let result;
    switch (path.split('/')[1]) {
      case 'notice':
        setHeader('공지사항');
        result = await getNoticeInfo(id);
        break;
      case 'board':
        setHeader('게시판');
        result = await getBoardDetail(id);
        break;
      case 'report':
        setHeader('주간 업무 보고');
        result = await getReportDetail(id);
        break;
      default:
        result = '';
    }
    if (typeof result === 'object') {
      setInfo(result?.data);
      document.querySelector('.content').innerHTML =
        new DOMParser().parseFromString(
          result?.data?.content,
          'text/html'
        ).body.innerHTML;
    } else {
      //에러핸들링
      return catchError(result, navigate, setAlertBox, setAlert);
    }
  };

  useEffect(() => {
    if (getCookie('myToken')) changeTitle(`그룹웨어 > 상세 보기`);
  }, []);

  useEffect(() => {
    if (getCookie('myToken')) getDetail();
  }, [id]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap'>
          <div className='header'>
            <h3>{header}</h3>
          </div>
          <div className='board-wrap'>
            <div className='header'>
              <h4>{info.title}</h4>
            </div>
            <div className='body-wrap'>
              <div className='writer'>
                <span>작성자</span>
                <div>{info.created_id}</div>
              </div>
              <div className='date'>
                <span>작성일</span>
                <div>{info?.created_at?.replace('T', ' ')}</div>
              </div>
              <div className='line'></div>
              <div className='content'></div>
            </div>
          </div>
          <div className='btn-wrap'>
            {info.created_id === localStorage.getItem('userName') ||
            (localStorage.getItem('yn') === 'n' &&
              path.split('/')[1] !== 'report') ? (
              <button
                className='commonBtn'
                onClick={() => navigate(`/${path.split('/')[1]}/write/${id}`)}>
                수정
              </button>
            ) : (
              <></>
            )}
            <button
              className='commonBtn list'
              onClick={() => navigate(`/${path.split('/')[1]}`)}>
              목록
            </button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'deleteAlert') navigate(`/${path.split('/')[1]}`);
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
            else return;
          }}
        />
      )}
    </>
  );
};

export default BoardRead;
