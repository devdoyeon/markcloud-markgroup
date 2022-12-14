import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import EditorComponent from 'common/EditorComponent';
import selectArrow from 'image/selectArrow.svg';
import deletePerson from 'image/deletePersonIcon.svg';
import CommonModal from 'common/CommonModal';
import { commonModalSetting } from 'js/commonUtils';

const NewProject = () => {
  const personArr = [
    '권도연',
    '안병욱',
    '김남호',
    '장지원',
    '정다은',
    '송지은',
  ];
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [statusSelect, setStatusSelect] = useState('off');
  const [personSelect, setPersonSelect] = useState('off');
  const [statusValue, setStatusValue] = useState('===');
  const [personValue, setPersonValue] = useState('===');
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
          <div className='createProjectWrap'>
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
                <div className={`selectBox ${statusSelect}`}>
                  <div
                    className={`selectVal`}
                    onClick={() =>
                      statusSelect === 'on'
                        ? setStatusSelect('off')
                        : setStatusSelect('on')
                    }>
                    {statusValue}
                    <img src={selectArrow} alt='선택 아이콘' />
                  </div>
                  {statusSelect === 'on' && (
                    <div className='selectOptGroup'>
                      <div
                        className={`selectOpt ${
                          statusValue === '시작 전' && 'active'
                        }`}
                        onClick={() => {
                          setStatusValue('시작 전');
                          setStatusSelect('off');
                        }}>
                        시작 전
                      </div>
                      <div
                        className={`selectOpt ${
                          statusValue === '진행 중' && 'active'
                        }`}
                        onClick={() => {
                          setStatusValue('진행 중');
                          setStatusSelect('off');
                        }}>
                        진행 중
                      </div>
                      <div
                        className={`selectOpt ${
                          statusValue === '종료' && 'active'
                        }`}
                        onClick={() => {
                          setStatusValue('종료');
                          setStatusSelect('off');
                        }}>
                        종료
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <hr />
              <div
                className='row peopleWrap'>
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
                  <div className={`selectBox ${personSelect}`}>
                    <div
                      className={`selectVal`}
                      onClick={() =>
                        personSelect === 'on'
                          ? setPersonSelect('off')
                          : setPersonSelect('on')
                      }>
                      {personValue}
                      <img src={selectArrow} alt='선택 아이콘' />
                    </div>
                    {personSelect === 'on' && (
                      <div className='selectOptGroup'>
                        {personArr.reduce((acc, person) => {
                          return (
                            <>
                              {acc}
                              <div
                                className={`selectOpt ${
                                  personValue === person && 'active'
                                }`}
                                onClick={() => {
                                  setPersonValue(person);
                                  setPersonSelect('off');
                                }}>
                                {person}
                              </div>
                            </>
                          );
                        }, <></>)}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className='addPersonBtn'
                  onClick={() =>
                    setParticipation(prev => {
                      const clone = [...prev];
                      if (clone.includes(personValue)) {
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
          <div className='btn-wrap'>
            <button className='commonBtn applyBtn'>등록</button>
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
          okFn={() => {}}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default NewProject;
