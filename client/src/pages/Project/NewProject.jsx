import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import EditorComponent from 'common/EditorComponent';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import { commonModalSetting, changeTitle} from 'js/commonUtils';

//= 입력값 체크 / 

const NewProject = () => {
  const statusArr = ['시작 전', '진행 중', '종료'];
  const { id } = useParams();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [selectVal, setSelectVal] = useState('===');
  const navigate = useNavigate();

  useEffect(() => {
    changeTitle('그룹웨어 > 프로젝트 작성')
  }, [])

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap project'>
          <div className='header'>
            <h3>새 프로젝트 생성</h3>
          </div>
          <div className='projectWrapper'>
            <div className='projectInfo column'>
              <hr />
              <div className='row makeProjectDate'>
                <span>프로젝트명</span>
                <input type='text' placeholder='제목을 입력해 주세요.' />
              </div>
              <hr />
              <div className='row date'>
                <div className='row start'>
                  <span>프로젝트 시작일</span>
                  <input type='date' />
                </div>
                <div className='row date'>
                  <span>프로젝트 종료일</span>
                  <input type='date' />
                </div>
              </div>
              <hr />
            </div>
            <EditorComponent />
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
            <button className='commonBtn applyBtn'>등록</button>
            <button
              className='commonBtn listBtn'
              onClick={() => {
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  `${id?.length ? '수정' : '작성'}을 취소하시겠습니까?<br/>${
                    id?.length ? '수정' : '작성'
                  }이 취소된 글은 복구할 수 없습니다.`
                );
                setAlert('cancel');
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
            if (alert === 'cancel') navigate('/project');
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
