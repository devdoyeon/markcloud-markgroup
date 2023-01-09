import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import EditorComponent from 'common/EditorComponent';
import SideMenu from 'common/SideMenu';
import {
  changeState,
  commonModalSetting,
  catchError,
  changeTitle,
  getKeyByValue,
} from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import BusinessProjectSelect from './BusinessCommonSelect';
import {
  createBusiness,
  deleteBusiness,
  getBusinessInfo,
  getBusinessProjectRead,
  getBusinessRead,
  updateBusiness,
} from 'js/groupwareApi';
import { getCookie } from 'js/cookie';
import { post } from 'jquery';

const BusinessEditBoard = () => {
  const [alert, setAlert] = useState('');
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({});
  const [postInfo, setPostInfo] = useState({
    project_name: '',
    status_filter: 'MyProject',
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
  const [requesterValue, setRequesterValue] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [progressValue, setProgressValue] = useState('선택');

  const [memberKey, setMemberKey] = useState([]);
  const [memberName, setMemberName] = useState([]);
  const [memberObj, setMemberObj] = useState({});
  const [memberCurKey, setMemberCurKey] = useState();

  const progressArr = ['요청', '접수', '진행', '완료'];

  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  const getBusinessCurInfo = async () => {
    const result = await getBusinessInfo(id);
    if (typeof result === 'object') {
      const {
        content,
        manager_id,
        project_name,
        request_id,
        title,
        work_status,
        created_id,
      } = result?.data[0];
      setPostInfo(prev => {
        const clone = { ...prev };
        clone.content = content;
        clone.project_name = project_name;
        clone.request_id = request_id;
        clone.manager_id = manager_id;
        clone.work_status = work_status;
        clone.title = title;
        clone.created_id = created_id;
        return clone;
      });
      setProjectValue(project_name);
      setContactValue(manager_id);
      setRequesterValue(request_id);
      setProgressValue(work_status);

      const memberRead = await getBusinessProjectRead(
        project_name,
        postInfo.status_filter,
        pageInfo
      );
      const { meta, data } = memberRead?.data;
      const key = Object.keys(meta?.project_member);
      const value = Object.values(meta?.project_member);
      setMemberKey(key);
      setMemberName(value);
      setMemberObj(meta?.project_member);

      if (memberKey.length > 0) {
        setPostInfo(prev => {
          const clone = { ...prev };
          clone.manager_id = getKeyByValue(memberObj, contactValue);
          clone.request_id = getKeyByValue(memberObj, requesterValue);
          return clone;
        });
      }
    }
  };
  const handleChangeRadioButton = (e, type) => {
    if (type === 'title') {
      changeState(setPostInfo, 'title', e.target.value);
    } else if (type === 'content') {
      changeState(setPostInfo, 'title', e.target.value);
    }
  };

  const editPost = async () => {
    const obj = { ...postInfo };
    obj.manager_id = getKeyByValue(memberObj, contactValue);
    obj.request_id = getKeyByValue(memberObj, requesterValue);

    const result = await updateBusiness(obj, id);
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

  const deletePost = async () => {
    const result = await deleteBusiness(id);
    if (typeof result === 'object') {
      setAlert('apply');
      return commonModalSetting(setAlertBox, true, 'alert', '삭제되었습니다.');
    } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  };

  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 업무 작성');

      if (id !== 'undefined' || id !== undefined) {
        getBusinessCurInfo();
      }
    }
  }, []);

  useEffect(() => {
    if (getCookie('myToken')) {
      changeState(setPostInfo, 'work_status', progressValue);
    }
  }, [progressValue]);
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
                <div className='selectBox detail'>{postInfo.project_name}</div>
              </div>
            </div>
            <div className='project-wrap board-head'>
              {/* ============================= */}
              <div className='project-list'>
                <span>요청자</span>
                <div className='selectBox'>{requesterValue}</div>
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>담당자</span>
                <BusinessProjectSelect
                  opt={memberName}
                  selectVal={contactValue}
                  nameKey={memberKey}
                  setMemberCurKey={setMemberCurKey}
                  setSelectVal={setContactValue}
                  postInfo={postInfo}
                  setPostInfo={setPostInfo}
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
              onClick={id?.length ? editPost : ''}>
              수정
            </button>
            {localStorage.getItem('yn') === 'n' ||
            localStorage.getItem('userId') === postInfo.created_id ? (
              <button
                className='commonBtn close'
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
                navigate(`/gp/business`);
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
              navigate(`/gp/${path.split('/')[2]}`);
            else if (alert === 'edit')
              navigate(`/gp/${path.split('/')[2]}/${id}`);
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/gp/sign-in');
            else if (alert === 'deleteConfirm') deletePost();
            else return;
          }}
        />
      )}
    </>
  );
};

export default BusinessEditBoard;
