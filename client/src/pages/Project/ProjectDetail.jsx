import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import deletePerson from 'image/deletePersonIcon.svg';
import { commonModalSetting } from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';

const ProjectDetail = () => {
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
  const navigate = useNavigate();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [statusValue, setStatusValue] = useState('===');
  const [personValue, setPersonValue] = useState('===');
  const [participation, setParticipation] = useState([]);

  const deleteProject = async () => {
    setAlert('completeDelete');
    commonModalSetting(setAlertBox, true, 'alert', `삭제되었습니다.`);
  };

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap project'>
          <div className='header'>
            <h3>프로젝트 현황</h3>
          </div>
          <div className='projectWrapper detail'>
            <div className='projectTitle'>제목제목제목제목</div>
            <div className='projectInfo column'>
              <hr />
              <div className='row makeProjectDate'>
                <span>작성일</span>
                <div className='projectDate'>0000-00-00</div>
              </div>
              <hr />
              <div className='row date'>
                <div className='row start'>
                  <span>프로젝트 시작일</span>
                  <div className='date-start'>0000-00-00</div>
                </div>
                <div className='row'>
                  <span>프로젝트 종료일</span>
                  <div className='date-end'>0000-00-00</div>
                </div>
              </div>
              <hr />
              <div className='content'>프로젝트입니다.</div>
              <hr />
              <div className='projectSetting column'>
                <hr />
                <div className='row statusSelect'>
                  <span>프로젝트 상태</span>
                  <CommonSelect
                    opt={statusArr}
                    selectVal={statusValue}
                    setSelectVal={setStatusValue}
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
                      selectVal={personValue}
                      setSelectVal={setPersonValue}
                    />
                  </div>
                  <button
                    className='addPersonBtn'
                    onClick={() =>
                      setParticipation(prev => {
                        const clone = [...prev];
                        if (clone.includes(personValue)) {
                          setAlert('duplicationPerson');
                          commonModalSetting(
                            setAlertBox,
                            true,
                            'alert',
                            '이미 추가된 인원입니다.'
                          );
                          return clone;
                        } else clone.push(personValue);
                        return clone;
                      })
                    }>
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='btn-wrap'>
            <button
              className='commonBtn deleteBtn'
              onClick={() => {
                setAlert('confirmDelete');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  `해당 프로젝트를 삭제하시겠습니까?<br/>삭제된 프로젝트는 복구할 수 없습니다.`
                );
              }}>
              삭제
            </button>
            <button
              className='commonBtn editBtn'
              onClick={() => navigate(`/project/write/${id}`)}>
              수정
            </button>
            <button
              className='commonBtn listBtn'
              onClick={() => navigate('/project')}>
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
            else if (alert === 'cancel' || alert === 'completeDelete')
              navigate('/project');
            else if (alert === 'confirmDelete') deleteProject();
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default ProjectDetail;
