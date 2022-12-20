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
} from 'js/commonUtils';
import { createProject } from 'js/groupwareApi';

//= 입력값 체크 /

const NewProject = () => {
  const statusArr = ['시작 전', '진행 중', '종료'];
  const date = new Date();
  const { id } = useParams();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
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

  const postProject = async () => {
    if (projectInfo.project_name.trim() === '')
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '프로젝트명을 입력해 주세요.'
      );
    else if (projectInfo.project_description.trim() === '')
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
      } else catchError(result, navigate, setAlertBox, setAlert);
    }
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 프로젝트 작성');
  }, []);

  useEffect(() => {
    changeState(setProjectInfo, 'project_status', selectVal);
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
            <button className='commonBtn applyBtn' onClick={postProject}>
              등록
            </button>
            {id?.length ? (
              <button className='commonBtn delete'>삭제</button>
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
            if (alert === 'cancel' || alert === 'completePost')
              navigate('/project');
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
            else return;
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default NewProject;
