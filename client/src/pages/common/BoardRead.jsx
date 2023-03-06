import { useState, useEffect } from 'react';
import SideMenu from 'common/SideMenu';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CommonModal from 'common/CommonModal';
import { replaceFn, catchError, changeTitle, text2html } from 'js/commonUtils';
import {
  getBoardDetail,
  getNoticeInfo,
  getReportDetail,
} from 'js/groupwareApi';
import { getCookie } from 'js/cookie';
import { str2img } from 'js/commonUtils';

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
    switch (path.split('/')[2]) {
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
      let str = str2img(result?.data?.img_url, result?.data?.content);
      str = replaceFn('view', str);
      text2html('.content', str);
      let obj = { ...result?.data };
      const title = replaceFn('view', result?.data?.title);
      obj.title = title;
      setInfo(obj);
    } else return catchError(result, navigate, setAlertBox, setAlert);
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
              path.split('/')[2] !== 'report') ? (
              <button
                className='commonBtn'
                onClick={() =>
                  navigate(`/mark-group/${path.split('/')[2]}/write/${id}`)
                }>
                수정
              </button>
            ) : (
              <></>
            )}
            <button
              className='commonBtn list'
              onClick={() => navigate(`/mark-group/${path.split('/')[2]}`)}>
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
            if (alert === 'deleteAlert')
              navigate(`/mark-group/${path.split('/')[2]}`);
            else if (alert === 'duplicateLogin')
              return navigate('/mark-group/sign-in');
            else if (alert === 'tokenExpired') navigate('/mark-group/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default BoardRead;
