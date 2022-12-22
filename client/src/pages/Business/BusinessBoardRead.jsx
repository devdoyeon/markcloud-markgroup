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
import CommonSelect from 'common/CommonSelect';
import { getBusinessInfo } from 'js/groupwareApi';
import { getCookie } from 'js/cookie';
import {
  getBoardDetail,
  createBoard,
  editBoard,
  editNotice,
  getNoticeInfo,
  createNotice,
} from 'js/groupwareApi';

const BusinessBoardRead = () => {
  const [alert, setAlert] = useState('');
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({});
  const [postInfo, setPostInfo] = useState({
    project_name: '==',
    title: '',
    content: '',
    work_status: '==',
    request_id: '==',
    manager_id: '==',
  });
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [info, setInfo] = useState({});

  const [projectValue, setProjectValue] = useState('===');
  const [requesterValue, setRequesterValue] = useState('===');
  const [contactValue, setContactValue] = useState('===');
  const [progressValue, setProgressValue] = useState('===');
  const progressArr = ['요청', '접수', '진행', '완료'];

  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  let prevent = false;

  const getDetail = async () => {
    if (prevent) return;
    prevent = false;
    setTimeout(() => {
      prevent = true;
    }, 200);
    let result;

    if (typeof result === 'object') {
      setInfo(result?.data);
      document.querySelector('.content').innerHTML =
        new DOMParser().parseFromString(
          result?.data?.content,
          'text/html'
        ).body.innerHTML;
    } else {
      catchError(result, navigate, setAlertBox, setAlert);
      //에러핸들링
    }
  };

  // const getProjectApi = async () => {
  //   if (prevent) return;
  //   prevent = true;
  //   setTimeout(() => {
  //     prevent = false;
  //   }, 200);
  //   const result = await getProjectRead(pageInfo);
  //   if (typeof result === 'object') {
  //     const { data, meta } = result?.data;
  //     setList(data);
  //     setMeta(meta);
  //     setPageInfo(prev => {
  //       const clone = { ...prev };
  //       clone.page = meta?.page;
  //       clone.totalPage = meta?.totalPage;
  //       return clone;
  //     });
  //   } else return catchError(result, navigate, setAlertBox, setAlert)
  // };

  // const handleChangeRadioButton = (e, type) => {
  //   if (type === 'title') {
  //     changeState(setPostInfo, 'title', e.target.value);
  //   } else if (type === 'content') {
  //     changeState(setPostInfo, 'title', e.target.value);
  //   }
  // };

  // const returnHeader = () => {
  //   switch (path.split('/')[1]) {
  //     case 'weekly':
  //       return '주간 업무 보고';
  //     case 'board':
  //       return '게시판';
  //     case 'notice':
  //       return '공지사항';
  //     default:
  //       break;
  //   }
  // };

  // const getProjectInfo = async () => {
  //   let result;
  //   switch (path.split('/')[1]) {
  //     case 'notice':
  //       result = await getNoticeInfo(id);
  //       break;
  //     case 'board':
  //       result = await getBoardDetail(id);
  //       break;
  //     case 'weekly':
  //       return;
  //     default:
  //   }
  //   if (typeof result === 'object') {
  //     setPostInfo(result?.data);
  //   } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  // };

  const getProjectDetail = async () => {
    const pathName = path.split(`/`)[1];
    if (pathName !== 'business') return;
    const result = await getBusinessInfo(id);

    if (typeof result === 'object') {
      setInfo(result?.data);
      document.querySelector('.content').innerHTML =
        new DOMParser().parseFromString(
          result?.data?.content,
          'text/html'
        ).body.innerHTML;
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };
  const editProject = async () => {
    let result;
    if (typeof result === 'object') {
      setAlert('edit');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '수정이 완료되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 상세 보기');
      if (id?.length) getProjectDetail();
    }
  }, []);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setPostInfo, 'project_name', projectValue);
  }, [projectValue]);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setPostInfo, 'request_id', requesterValue);
  }, [requesterValue]);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setPostInfo, 'manager_id', contactValue);
  }, [contactValue]);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setPostInfo, 'work_status', progressValue);
  }, [progressValue]);

  useEffect(() => {
    if (getCookie('myToken')) if (id?.length) getProjectDetail();
  }, []);

  const {
    created_at,
    manager_id,
    project_name,
    request_id,
    title,
    work_end_date,
    work_status,
  } = info;

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap business'>
          <div className='header'>
            <h3>업무 관리</h3>
          </div>

          <div className='work-wrap project-work-wrap'>
            <div className='project-wrap project-name'>
              <div className='project-list'>
                <span className='pro'>프로젝트</span>
                <div>{project_name}</div>
              </div>
            </div>
            <div className='project-wrap board-head'>
              {/* ============================= */}
              <div className='project-list'>
                <span>요청자</span>
                <div>{request_id}</div>
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>담당자</span>
                <div>{manager_id}</div>
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>진행상태</span>
                <div>{work_status}</div>
              </div>
            </div>
            <div className='project-wrap title'>
              <span>제목</span>
              <div className='title-input-wrap'>
                <div className='input-read'>{title}</div>
              </div>
            </div>
            <div className='content edit'>
              {/* <EditorComponent
                content={postInfo.content}
                setContent={setPostInfo}
                col='content'
              /> */}
            </div>
          </div>
          <div className='btn-wrap'>
            <button className='commonBtn applyBtn' onClick={editProject}>
              수정
            </button>
            <button
              className='commonBtn list'
              onClick={() => {
                setAlert('cancel');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  `수정을 취소하시겠습니까?<br/>
                    수정
                  이 취소된 글은 복구할 수 없습니다.`
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
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
            else if (alert === 'edit') navigate(`/${path.split('/')[1]}/${id}`);
            else return;
          }}
        />
      )}
    </>
  );
};

export default BusinessBoardRead;
