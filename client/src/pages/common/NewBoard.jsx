import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import EditorComponent from 'common/EditorComponent';
import SideMenu from 'common/SideMenu';
import {
  changeState,
  commonModalSetting,
  catchError,
  changeTitle,
} from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import {
  getBoardDetail,
  createBoard,
  editBoard,
  getReportDetail,
  createReport,
  editReport,
  editNotice,
  getNoticeInfo,
  createNotice,
} from 'js/groupwareApi';
import { getCookie } from 'js/cookie';

const NewBoard = () => {
  const [alert, setAlert] = useState('');
  const [postInfo, setPostInfo] = useState({
    created_id: '',
    title: '',
    content: '',
  });
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();
  const cookie = getCookie('myToken');

  const returnHeader = () => {
    switch (path.split('/')[1]) {
      case 'report':
        return '주간 업무 보고';
      case 'board':
        return '게시판';
      case 'notice':
        return '공지사항';
      default:
        break;
    }
  };

  const findEmptyValue = () => {
    const tagRegExp = /<[^>]*>?/g;
    if (postInfo.title.trim() === '') return 'emptyTitle';
    else if (postInfo.content.replace(tagRegExp, '').trim() === '')
      return 'emptyContent';
  };

  const getOriginDetail = async () => {
    let result;
    switch (path.split('/')[1]) {
      case 'notice':
        result = await getNoticeInfo(id);
        break;
      case 'board':
        result = await getBoardDetail(id);
        break;
      case 'report':
        result = await getReportDetail(id);
        break;
      default:
        return;
    }
    if (typeof result === 'object') {
      setPostInfo(result?.data);
    } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  };

  const createNew = async () => {
    if (findEmptyValue() === 'emptyTitle')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '제목을 입력해 주세요.'
      );
    else if (findEmptyValue() === 'emptyContent')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '내용을 입력해 주세요.'
      );
    let result;
    switch (path.split('/')[1]) {
      case 'notice':
        result = await createNotice(postInfo, cookie);
        break;
      case 'board':
        result = await createBoard(postInfo);
        break;
      case 'report':
        result = await createReport(postInfo);
        break;
      default:
    }
    if (typeof result === 'object') {
      setAlert('apply');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '등록이 완료되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  };

  const editPost = async () => {
    if (findEmptyValue() === 'emptyTitle')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '제목을 입력해 주세요.'
      );
    else if (findEmptyValue() === 'emptyContent')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '내용을 입력해 주세요.'
      );
    let result;
    switch (path.split('/')[1]) {
      case 'notice':
        result = await editNotice(postInfo, id, cookie);
        break;
      case 'board':
        result = await editBoard(postInfo, id);
        break;
      case 'report':
        result = await editReport(postInfo, id);
        break;
      default:
        return;
    }
    if (typeof result === 'object') {
      setAlert('edit');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '수정이 완료되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 작성');
    changeState(setPostInfo, 'created_id', localStorage.getItem('userName'));
  }, []);

  useEffect(() => {
    if (id?.length) getOriginDetail();
  }, []);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap'>
          <div className='header'>
            <h3>{returnHeader()}</h3>
          </div>
          <div className='board-wrap'>
            <div className='body-wrap'>
              <div className='writer'>
                <span>작성자</span>
                <div>{postInfo?.created_id}</div>
              </div>
              <div className='title'>
                <span>제목</span>
                <div>
                  <input
                    type='text'
                    placeholder='제목을 입력해 주세요.'
                    className='title-input'
                    value={postInfo?.title}
                    onChange={e =>
                      changeState(setPostInfo, 'title', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className='line'></div>
              <div className='content'>
                <EditorComponent
                  content={postInfo?.content}
                  setContent={setPostInfo}
                  col='content'
                />
              </div>
              <div className='line'></div>
            </div>
          </div>
          <div className='btn-wrap'>
            <button
              className='commonBtn applyBtn'
              onClick={id?.length ? editPost : createNew}>
              등록
            </button>
            {id?.length ? (
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
            ) : (
              <></>
            )}
            <button
              className='commonBtn list'
              onClick={() => {
                setAlert('cancel');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  `${id?.length ? '수정' : '작성'}을 취소하시겠습니까?<br/>${
                    id?.length ? '수정' : '작성'
                  }이 취소된 글은 복구할 수 없습니다.`
                );
              }}>
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
            if (alert === 'cancel' || alert === 'apply')
              navigate(`/${path.split('/')[1]}`);
            else if (alert === 'edit') navigate(`/${path.split('/')[1]}/${id}`);
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
            else return;
          }}
        />
      )}
    </>
  );
};

export default NewBoard;
