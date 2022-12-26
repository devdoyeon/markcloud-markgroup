import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import EditorComponent from 'common/EditorComponent';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import {
  commonModalSetting,
  changeTitle,
  changeState,
  catchError,
  emptyCheck,
} from 'js/commonUtils';
import {
  getProjectDetail,
  createProject,
  editProject,
  deleteProject,
} from 'js/groupwareApi';
import { getCookie } from 'js/cookie';

const NewProject = () => {
  const statusArr = ['시작 전', '진행 중', '종료'];
  const date = new Date();
  const { id } = useParams();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [selectVal, setSelectVal] = useState('선택');
  const [projectInfo, setProjectInfo] = useState({
    project_name: '',
    project_description: '',
    project_start_date: `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`,
    project_end_date: `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`,
    project_status: selectVal,
  });
  const navigate = useNavigate();

  const updateProject = async () => {
    const result = await editProject(id, projectInfo);
    if (typeof result === 'object') {
      setAlert('completeEdit');
      commonModalSetting(setAlertBox, true, 'alert', '수정이 완료되었습니다.');
    }
  };

  //= 수정일 때 기존 디테일 불러오기
  const getOrigin = async () => {
    const result = await getProjectDetail(id);
    if (typeof result === 'object') {
      const {
        project_name,
        project_description,
        project_start_date,
        project_end_date,
        project_status,
        created_id,
      } = result?.data;
      if (
        localStorage.getItem('yn') === 'y' &&
        created_id !== localStorage.getItem('userName')
      ) {
        setAlert('notAuthority');
        commonModalSetting(setAlertBox, true, 'alert', '접근 권한이 없습니다.');
      }
      setProjectInfo(prev => {
        const clone = { ...prev };
        clone.project_name = project_name;
        clone.project_description = project_description;
        clone.project_start_date = project_start_date;
        clone.project_end_date = project_end_date;
        return clone;
      });
      setSelectVal(project_status);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 작성일 때 입력값 확인 후 새 프로젝트 생성
  const postProject = async () => {
    if (!emptyCheck(projectInfo.project_name))
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '프로젝트명을 입력해 주세요.'
      );
    else if (!emptyCheck(projectInfo.project_description))
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '프로젝트 내용을 입력해 주세요.'
      );
    else if (projectInfo.project_status === '선택')
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '프로젝트 상태를 선택해 주세요.'
      );
    else {
      const result = await createProject(projectInfo);
      if (typeof result === 'object') {
        setAlert('completePost');
        commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '등록이 완료되었습니다.'
        );
      } else return catchError(result, navigate, setAlertBox, setAlert);
    }
  };

  //= 프로젝트 삭제
  const deleteCurProject = async () => {
    const result = await deleteProject(id);
    if (typeof result === 'object') {
      setAlert('completeDelete');
      commonModalSetting(setAlertBox, true, 'alert', `삭제되었습니다.`);
    }
  };

  useEffect(() => {
    if (id?.length && getCookie('myToken')) {
      changeTitle('그룹웨어 > 프로젝트 작성');
      getOrigin();
    } else return;
  }, []);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setProjectInfo, 'project_status', selectVal);
    let kor = selectVal;
    switch (kor) {
      case '전체':
        setSelectVal('all');
        break;
      case '시작 전':
        setSelectVal('before');
        break;
      case '진행 중':
        setSelectVal('progress');
        break;
      case '종료':
        setSelectVal('complete');
        break;
      default:
        return;
    }
  }, [selectVal]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap project'>
          <div className='header'>
            <h3
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
              프로젝트 현황
            </h3>
          </div>
          <div className='projectWrapper'>
            <div className='projectInfo column'>
              <hr />
              <div className='row makeProjectDate'>
                <span>프로젝트명</span>
                <input
                  type='text'
                  placeholder='제목을 입력해 주세요.'
                  value={projectInfo.project_name}
                  onChange={e =>
                    changeState(setProjectInfo, 'project_name', e.target.value)
                  }
                />
              </div>
              <hr />
              <div className='row date'>
                <div className='row start'>
                  <span>프로젝트 시작일</span>
                  <input
                    type='date'
                    value={projectInfo.project_start_date}
                    onChange={e =>
                      changeState(
                        setProjectInfo,
                        'project_start_date',
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className='row date'>
                  <span>프로젝트 종료일</span>
                  <input
                    type='date'
                    value={projectInfo.project_end_date}
                    onChange={e =>
                      changeState(
                        setProjectInfo,
                        'project_end_date',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <hr />
            </div>
            <EditorComponent
              content={projectInfo.project_description}
              setContent={setProjectInfo}
              col='project_description'
            />
            <div className='projectSetting column'>
              <hr />
              <div className='row statusSelect'>
                <span>프로젝트 상태</span>
                <CommonSelect
                  opt={statusArr}
                  selectVal={selectVal}
                  setSelectVal={setSelectVal}
                />
              </div>
            </div>
          </div>
          <div className='btn-wrap'>
            <button
              className='commonBtn applyBtn'
              onClick={id?.length ? updateProject : postProject}>
              {id?.length ? '수정' : '등록'}
            </button>
            {id?.length ? (
              <button
                className='commonBtn delete'
                onClick={() => {
                  setAlert('confirmDelete');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    `삭제된 프로젝트는 복구할 수 없습니다.<br/>정말 삭제하시겠습니까?`
                  );
                }}>
                삭제
              </button>
            ) : (
              <></>
            )}
            <button
              className='commonBtn listBtn'
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
              alert === 'completePost' ||
              alert === 'completeDelete' ||
              alert === 'completeEdit'
            )
              navigate('/project');
            else if (alert === 'notAuthority') navigate(`/project/${id}`);
            else if (alert === 'confirmDelete') deleteCurProject();
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
            else return;
          }}
        />
      )}
    </>
  );
};

export default NewProject;
