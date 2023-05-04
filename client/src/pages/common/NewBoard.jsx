import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import EditorComponent from 'common/EditorComponent';
import SideMenu from 'common/SideMenu';
import {
  changeState,
  commonModalSetting,
  catchError,
  changeTitle,
  emptyCheck,
  makeFormData,
  replaceFn,
} from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import {
  getBoardDetail,
  createBoard,
  editBoard,
  deleteBoard,
  getReportDetail,
  createReport,
  editReport,
  deleteReport,
  editNotice,
  getNoticeInfo,
  createNotice,
  deleteNotice,
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

  const inputFile = useRef();

  const returnHeader = () => {
    switch (path.split('/')[2]) {
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

  //= 빈 input 찾기
  const findEmptyValue = () => {
    const tagRegExp = /<[^>]*>?/g;
    if (!emptyCheck(postInfo.title)) return 'emptyTitle';
    else if (!emptyCheck(postInfo.content.replace(tagRegExp, '')))
      return 'emptyContent';
  };

  //= 수정일 때 기존 상세내역 불러오기
  const getOriginDetail = async () => {
    let result;
    switch (path.split('/')[2]) {
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
      if (
        result?.data?.created_id !== localStorage.getItem('userName') &&
        (localStorage.getItem('yn') === 'y' ||
          (localStorage.getItem('yn') === 'n' &&
            path.split('/')[2] === 'report'))
      ) {
        setAlert('notAuthority');
        commonModalSetting(setAlertBox, true, 'alert', '접근 권한이 없습니다.');
      }
      const obj = { ...result?.data };
      let content = obj.content;
      if (result?.data?.img_url?.length)
        for (let i = 0; i < result?.data?.img_url.length; i++) {
          content = content.replace(
            `UploadedImage${i}`,
            `<img src=${result?.data?.img_url[i]}></img>`
          );
        }
      content = replaceFn('view', content);
      obj.content = content;
      obj.title = replaceFn('view', obj.title);
      setPostInfo(obj);
    } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  };

  //= new post upload
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
    const editor = document.querySelector('.ql-editor');
    const img = editor.querySelectorAll('img');
    const formData = makeFormData();
    let result;
    switch (path.split('/')[2]) {
      case 'notice':
        result = await createNotice(
          postInfo.title,
          editor.innerHTML,
          img.length ? formData : null
        );
        break;
      case 'board':
        result = await createBoard(
          postInfo.title,
          editor.innerHTML,
          img.length ? formData : null
        );
        break;
      case 'report':
        result = await createReport(
          postInfo.title,
          editor.innerHTML,
          img.length ? formData : null
        );
        break;
      default:
        return;
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

  //= delete post
  const deletePost = async () => {
    let result;
    switch (path.split('/')[2]) {
      case 'notice':
        result = await deleteNotice(id);
        break;
      case 'board':
        result = await deleteBoard(id);
        break;
      case 'report':
        result = await deleteReport(id);
        break;
      default:
        result = '';
    }
    if (typeof result === 'object') {
      setAlert('deleteAlert');
      commonModalSetting(setAlertBox, true, 'alert', '삭제되었습니다.');
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= edit post
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
    const editor = document.querySelector('.ql-editor');
    const imgArr = editor.querySelectorAll('img');
    const formData = makeFormData();
    let result;
    switch (path.split('/')[2]) {
      case 'notice':
        result = await editNotice(
          postInfo.title,
          editor.innerHTML,
          imgArr.length ? formData : null,
          id
        );
        break;
      case 'board':
        result = await editBoard(
          postInfo.title,
          editor.innerHTML,
          imgArr.length ? formData : null,
          id
        );
        break;
      case 'report':
        result = await editReport(
          postInfo.title,
          editor.innerHTML,
          imgArr.length ? formData : null,
          id
        );
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
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 작성');
      changeState(setPostInfo, 'created_id', localStorage.getItem('userName'));
    }
  }, []);

  useEffect(() => {
    if (getCookie('myToken')) if (id?.length) getOriginDetail();
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
                    maxLength='30'
                    value={postInfo?.title}
                    onChange={e => {
                      if (e.target.value.length > 30) {
                        commonModalSetting(
                          setAlertBox,
                          true,
                          'alert',
                          '제목은 최대 30자까지 입력 가능합니다.'
                        );
                        return;
                      }
                      changeState(setPostInfo, 'title', e.target.value);
                    }}
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
              {id?.length ? '수정' : '등록'}
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
            if (
              alert === 'cancel' ||
              alert === 'apply' ||
              alert === 'deleteAlert'
            )
              navigate(`/mark-group/${path.split('/')[2]}`);
            else if (alert === 'deleteConfirm') deletePost();
            else if (alert === 'edit' || alert === 'notAuthority')
              navigate(`/mark-group/${path.split('/')[2]}/${id}`);
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

export default NewBoard;
