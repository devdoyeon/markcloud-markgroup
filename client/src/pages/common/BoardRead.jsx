import { useState, useEffect } from 'react';
import SideMenu from 'common/SideMenu';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import CommonModal from 'common/CommonModal';
import { commonModalSetting } from 'js/commonUtils';
import {
  getBoardDetail,
  deleteBoard,
  getNoticeInfo,
  deleteNotice,
  getReportDetail,
  deleteReport,
} from 'js/groupwareApi';

const BoardRead = () => {
  const path = useLocation().pathname;
  let prevent = false;
  const navigate = useNavigate();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const { id } = useParams();
  const [header, setHeader] = useState('');
  const [info, setInfo] = useState({});

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
        setHeader('사내게시판');
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
      return;
    }
  };

  const deletePost = async () => {
    let result;
    switch (path.split('/')[1]) {
      case 'notice':
        setHeader('공지사항');
        result = await deleteNotice(id);
        break;
      case 'board':
        setHeader('사내게시판');
        result = await deleteBoard(id);
        break;
      case 'report':
        setHeader('주간 업무 보고');
        result = await deleteReport(id);
        break;
      default:
        result = '';
    }
    if (typeof result === 'object') {
      setAlert('deleteAlert');
      commonModalSetting(setAlertBox, true, 'alert', '삭제되었습니다.');
    } else return
  };

  useEffect(() => {
    getDetail();
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
            <button
              className='commonBtn delete'
              onClick={() => {
                setAlert('deleteConfirm');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  '정말 삭제하시겠습니까?<br/>삭제된 글은 복구할 수 없습니다.'
                );
              }}>
              삭제
            </button>
            <button
              className='commonBtn'
              onClick={() => navigate(`/${path.split('/')[1]}/write/${id}`)}>
              수정
            </button>
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
            if (alert === 'deleteConfirm') deletePost();
            else if (alert === 'deleteAlert')
              navigate(`/${path.split('/')[1]}`);
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default BoardRead;
