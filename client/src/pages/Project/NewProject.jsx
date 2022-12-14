import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import EditorComponent from 'common/EditorComponent';
import deletePerson from 'image/deletePersonIcon.svg';
import CommonModal from 'common/CommonModal';
import { commonModalSetting } from 'js/commonUtils';
import CommonSelect from 'common/CommonSelect';

const NewProject = () => {
  const statusArr = ['시작 전', '진행 중', '종료'];
  const personArr = [
    '권도연',
    '안병욱',
    '김남호',
    '장지원',
    '정다은',
    '송지은',
  ];
  const { id } = useParams();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [selectVal, setSelectVal] = useState('===');
  const [peopleVal, setPeopleVal] = useState('===');
  const [participation, setParticipation] = useState([]);
  const navigate = useNavigate();

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap project'>
          <div className='header'>
            <h3>프로젝트 현황</h3>
          </div>
          <div className='projectWrapper'>
            <div className='projectInfo column'>
              <hr />
              <div className='row makeProjectDate'>
                <span>프로젝트명</span>
                <input type='text' />
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
              <hr />
              <div className='row peopleWrap'>
                <span>참여 목록</span>
                <div className='row'>
                  {participation?.length === 0
                    ? '참여 인원을 추가해 주세요.'
                    : participation?.reduce((acc, person) => {
                        return (
                          <>
                            {acc}
                            <span className='personBtn'>
                              {person}
                              <img
                                src={deletePerson}
                                alt={`${person} 삭제 버튼`}
                                onClick={() => {
                                  setParticipation(prev => {
                                    const clone = [...prev];
                                    clone.splice(clone.indexOf(person), 1);
                                    return clone;
                                  });
                                }}
                              />
                            </span>
                          </>
                        );
                      }, <></>)}
                </div>
              </div>
              <div className='row'>
                <span>참여 인원 추가</span>
                <div className='people column'>
                  <CommonSelect
                    opt={personArr}
                    selectVal={peopleVal}
                    setSelectVal={setPeopleVal}
                  />
                </div>
                <button
                  className='addPersonBtn'
                  onClick={() =>
                    setParticipation(prev => {
                      const clone = [...prev];
                      if (clone.includes(peopleVal)) {
                        setAlert('duplicationPerson');
                        commonModalSetting(
                          setAlertBox,
                          true,
                          'alert',
                          '이미 추가된 인원입니다.'
                        );
                        return clone;
                      } else clone.push(peopleVal);
                      return clone;
                    })
                  }>
                  추가
                </button>
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
            if (alert === 'duplicationPerson') return;
            else if (alert === 'cancel') navigate('/project');
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default NewProject;
