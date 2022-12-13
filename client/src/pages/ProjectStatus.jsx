import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import selectArrow from 'image/selectArrow.svg';
import CommonModal from 'common/CommonModal';

const ProjectStatus = () => {
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('created_id');
  const [searchText, setSearchText] = useState('');
  const [select, setSelect] = useState('off');
  const [value, setValue] = useState('');
  const status = !!list?.length;
  const navigate = useNavigate();

  const returnStatus = () => {
    switch (value) {
      case '':
        return '===';
      case 'notStarted':
        return '시작 전';
      case 'ing':
        return '진행 중';
      case 'end':
        return '종료';
      default:
        return;
    }
  };

  const commonHeaderState = {
    filter,
    setFilter,
    searchText,
    setSearchText,
    status,
  };

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap'>
          <CommonHeader {...commonHeaderState} />
          <div className='selectArea column'>
            <hr />
            <div className='row'>
              <div className='row'>
                <span>프로젝트명</span>
                <input type='text' />
              </div>
              <div className='row'>
                <span>프로젝트 상태</span>
                <div className={`selectBox status ${select}`}>
                  <div
                    className={`selectVal`}
                    onClick={() =>
                      select === 'on' ? setSelect('off') : setSelect('on')
                    }>
                    {returnStatus()}
                    <img src={selectArrow} alt='선택 아이콘' />
                  </div>
                  {select === 'on' && (
                    <div className='selectOptGroup'>
                      <div
                        className={`selectOpt ${
                          value === 'notStarted' && 'active'
                        }`}
                        onClick={() => {
                          setValue('notStarted');
                          setSelect('off');
                        }}>
                        시작 전
                      </div>
                      <div
                        className={`selectOpt ${value === 'ing' && 'active'}`}
                        onClick={() => {
                          setValue('ing');
                          setSelect('off');
                        }}>
                        진행 중
                      </div>
                      <div
                        className={`selectOpt ${value === 'end' && 'active'}`}
                        onClick={() => {
                          setValue('end');
                          setSelect('off');
                        }}>
                        종료
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className='row'>
              <div className='row'>
                <span>프로젝트 시작일</span>
                <input type='date' />
              </div>
              <div className='row'>
                <span>프로젝트 종료일</span>
                <input type='date' />
              </div>
            </div>
            <hr />
            <div className='row btnWrap'>
              <button className='commonBtn searchBtn'>검색</button>
              <button className='commonBtn resetBtn'>초기화</button>
              <button
                className='commonBtn applyBtn'
                onClick={() => navigate('/project/write')}>
                등록
              </button>
            </div>
          </div>
          <div className='table-wrap'>
            <div className='table'>
              <table>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>프로젝트 상태</th>
                    <th>프로젝트 명</th>
                    <th>시작일</th>
                    <th>종료일</th>
                    <th>참여인원</th>
                  </tr>
                </thead>
                <tbody>
                  {new Array(5).fill('').reduce((acc, i, idx) => {
                    return (
                      <>
                        {acc}
                        <tr className={idx % 2 === 1 ? 'odd' : 'even'}>
                          <td>{idx}</td>
                          <td>{idx}</td>
                          <td>{idx}</td>
                          <td>{idx}</td>
                          <td>{idx}</td>
                          <td>{idx}</td>
                        </tr>
                      </>
                    );
                  }, <></>)}
                </tbody>
              </table>
            </div>
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

export default ProjectStatus;
