import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import EditorComponent from 'common/EditorComponent';
import SideMenu from 'common/SideMenu';
import {
  changeState,
  commonModalSetting,
  catchError,
  changeTitle,
  makeFormData,
} from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import BusinessCommonSelect from './BusinessCommonSelect';
import { createBusiness, getBusinessRead } from 'js/groupwareApi';
import { getCookie } from 'js/cookie';

const BusinessNewBoard = () => {
  const [alert, setAlert] = useState('');
  const [meta, setMeta] = useState({});
  const [postInfo, setPostInfo] = useState({
    project_name: '',
    status_filter: localStorage.getItem('yn') === 'y' ? 'MyProject' : 'All',
    manager_id: '',
    request_id: '',
    title: '',
    content: '',
    progress_status: [],
    work_status: '',
  });
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 0,
    limit: 5,
  });

  const [projectValue, setProjectValue] = useState('선택');
  const [requesterValue, setRequesterValue] = useState('선택');
  const [contactValue, setContactValue] = useState('선택');
  const [progressValue, setProgressValue] = useState('선택');

  const [memberKey, setMemberKey] = useState([]);
  const [memberName, setMemberName] = useState([]);
  const [memberCurKey, setMemberCurKey] = useState();

  const progressArr = ['요청', '접수', '진행', '완료'];

  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  let prevent = false;

  const getBusinessProjectNameApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);

    const result = await getBusinessRead(postInfo, pageInfo);
    if (typeof result === 'object') {
      const { meta } = result?.data;
      const key = Object.keys(meta?.project_member);
      const value = Object.values(meta?.project_member);
      setMemberKey(key);
      setMemberName(value);
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
  const createWorkBusiness = async () => {
    if (postInfo.project_name === '' || postInfo.project_name === '선택') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '프로젝트를 선택해주세요.'
      );
    } else if (
      postInfo.request_id === '' ||
      postInfo.request_id === '선택' ||
      postInfo.request_id === undefined ||
      postInfo.request_id === 'undefined'
    ) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '요청자를 선택해주세요.'
      );
    } else if (
      postInfo.manager_id === '' ||
      postInfo.manager_id === '선택' ||
      postInfo.manager_id === undefined ||
      postInfo.manager_id === 'undefined'
    ) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '담당자를 선택해주세요.'
      );
    } else if (
      postInfo.work_status === '' ||
      postInfo.work_status === '선택' ||
      postInfo.work_status === undefined ||
      postInfo.work_status === 'undefined'
    ) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '진행상태를 선택해주세요.'
      );
    } else if (postInfo.title === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '제목을 입력해주세요'
      );
    } else if (postInfo.content === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '내용을 입력해주세요.'
      );
    } else {
      const editor = document.querySelector('.ql-editor');
      const img = editor.querySelectorAll('img');
      const formData = makeFormData();
      const result = await createBusiness(
        postInfo,
        editor.innerHTML,
        img.length ? formData : null
      );
      if (typeof result === 'object') {
        setAlert('apply');
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '등록이 완료되었습니다.'
        );
      } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
    }
  };

  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 업무 작성');
      getBusinessProjectNameApi();
    }
  }, []);

  useEffect(() => {
    if (getCookie('myToken')) {
      getBusinessProjectNameApi();
    }
  }, [postInfo.status_filter, postInfo.project_name]);
  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setPostInfo, 'request_id', memberCurKey);
  }, [requesterValue]);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setPostInfo, 'manager_id', memberCurKey);
  }, [contactValue]);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setPostInfo, 'work_status', progressValue);
  }, [progressValue]);

  useEffect(() => {
    if (getCookie('myToken')) {
      changeState(setPostInfo, 'project_name', projectValue);
    }
  }, [projectValue]);

  const { project_name } = meta;

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
              <div className='project-list'>
                <span>요청자</span>
                <BusinessCommonSelect
                  opt={memberName}
                  selectVal={requesterValue}
                  nameKey={memberKey}
                  setMemberCurKey={setMemberCurKey}
                  setSelectVal={setRequesterValue}
                  postInfo={postInfo}
                  setPostInfo={setPostInfo}
                  projectValue={projectValue}
                />
              </div>
              <div className='project-list'>
                <span>담당자</span>
                <BusinessCommonSelect
                  opt={memberName}
                  selectVal={contactValue}
                  nameKey={memberKey}
                  setMemberCurKey={setMemberCurKey}
                  setSelectVal={setContactValue}
                  postInfo={postInfo}
                  setPostInfo={setPostInfo}
                  projectValue={projectValue}
                />
              </div>
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
                    maxLength='30'
                    onChange={e => handleChangeRadioButton(e, 'title')}
                    value={postInfo?.title}
                  />
                </label>
              </div>
            </div>
            <div className='content edit'>
              <EditorComponent
                content={postInfo?.content}
                setContent={setPostInfo}
                col='content'
              />
            </div>
          </div>
          <div className='btn-wrap'>
            <button
              className='commonBtn applyBtn'
              onClick={() => createWorkBusiness()}>
              등록
            </button>
            <button
              className='commonBtn list'
              onClick={() => {
                navigate(`/business`);
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
              navigate(`/mark-groupware/${path.split('/')[2]}`);
            else if (alert === 'edit')
              navigate(`/mark-groupware/${path.split('/')[2]}/${id}`);
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/mark-groupware/sign-in');
            else return;
          }}
        />
      )}
    </>
  );
};

export default BusinessNewBoard;
