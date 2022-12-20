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
import { createBusiness, getBusinessRead } from 'js/groupwareApi';
import {
  getBoardDetail,
  createBoard,
  editBoard,
  editNotice,
  getNoticeInfo,
  createNotice,
} from 'js/groupwareApi';

const BusinessNewBoard = () => {
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
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 15,
    limit: 5,
  });

  const [projectValue, setProjectValue] = useState('===');
  const [requesterValue, setRequesterValue] = useState('===');
  const [contactValue, setContactValue] = useState('===');
  const [progressValue, setProgressValue] = useState('===');
  const progressArr = ['요청', '접수', '진행', '완료'];

  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  let prevent = false;

  const getProjectApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getBusinessRead(pageInfo);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setList(data);
      setMeta(meta);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const handleChangeRadioButton = (e, type) => {
    if (type === 'title') {
      changeState(setPostInfo, 'title', e.target.value);
    } else if (type === 'content') {
      changeState(setPostInfo, 'title', e.target.value);
    }
  };

  // const returnHeader = () => {
  //   switch (path.split('/')[1]) {
  //     case 'report':
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
  //     case 'report':
  //       return;
  //     default:
  //   }
  //   if (typeof result === 'object') {
  //     setPostInfo(result?.data);
  //   } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  // };

  const getProjectInfo = async () => {
    const pathName = path.split(`/`)[1];
    if (pathName !== 'business') return;
    // const result = await

    // if (typeof result === 'object') {
    //   setPostInfo(result?.data);
    // } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  };

  const createNew = async () => {
    const result = await createBusiness(postInfo);

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
    let result;
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
    changeTitle('그룹웨어 > 업무 작성');
    // if (id?.length) getOriginDetail();
    getProjectApi();
  }, []);

  useEffect(() => {
    changeState(setPostInfo, 'project_name', projectValue);
  }, [projectValue]);

  useEffect(() => {
    changeState(setPostInfo, 'request_id', requesterValue);
  }, [requesterValue]);

  useEffect(() => {
    changeState(setPostInfo, 'manager_id', contactValue);
  }, [contactValue]);

  useEffect(() => {
    changeState(setPostInfo, 'work_status', progressValue);
  }, [progressValue]);

  // useEffect(()=> {
  //   if(id?.length) getProjectInfo();
  // },[])

  const { member_id, project_name } = meta;

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
                <CommonSelect
                  opt={project_name}
                  selectVal={projectValue}
                  setSelectVal={setProjectValue}
                />
              </div>
            </div>
            <div className='project-wrap board-head'>
              {/* ============================= */}
              <div className='project-list'>
                <span>요청자</span>
                <CommonSelect
                  opt={member_id}
                  selectVal={requesterValue}
                  setSelectVal={setRequesterValue}
                />
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>담당자</span>
                <CommonSelect
                  opt={member_id}
                  selectVal={contactValue}
                  setSelectVal={setContactValue}
                />
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>진행상태</span>
                <CommonSelect
                  opt={progressArr}
                  selectVal={progressValue}
                  setSelectVal={setProgressValue}
                />
              </div>
            </div>
            <div className='project-wrap title'>
              <span>제목</span>
              <div className='title-input-wrap'>
                <label>
                  <input
                    type='text'
                    placeholder='제목을 입력해 주세요.'
                    onChange={e => handleChangeRadioButton(e, 'title')}
                  />
                </label>
              </div>
            </div>
            <div className='content edit'>
              <EditorComponent
                content={postInfo.content}
                setContent={setPostInfo}
                col='content'
              />
            </div>
          </div>
          <div className='btn-wrap'>
            <button
              className='commonBtn applyBtn'
              onClick={id?.length ? editPost : createNew}>
              등록
            </button>
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

export default BusinessNewBoard;
