import { useState } from 'react';
import SideMenu from 'common/SideMenu';
import EditorComponent from 'common/EditorComponent';
import selectArrow from 'image/selectArrow.svg';

const NewProject = () => {
  const personArr = [
    '권도연',
    '안병욱',
    '김남호',
    '장지원',
    '정다은',
    '송지은',
  ];
  const [statusSelect, setStatusSelect] = useState('off');
  const [personSelect, setPersonSelect] = useState('off');
  const [statusValue, setStatusValue] = useState('===');
  const [personValue, setPersonValue] = useState('===');

  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap project'>
        <div className='header'>
          <h3>새 프로젝트 생성</h3>
        </div>
        <div className='createProjectWrap'>
          <div className='projectInfo column'>
            <hr />
            <div className='row projectName'>
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
            <div className='row'>
              <span>참여 인원</span>
            </div>
            <hr />
          </div>
          <EditorComponent />
          <div className='projectSetting column'>
            <div className='row'>
              <span>프로젝트 상태</span>
              <div className={`selectBox status ${statusSelect}`}>
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
            <div className='row'>
              <span>참여 인원</span>
              <div className='people column'>
                <div className={`selectBox status ${personSelect}`}>
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
              <button className='addPersonBtn'>추가</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
