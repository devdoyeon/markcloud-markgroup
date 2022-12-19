import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import Pagination from 'common/Pagination';
import { changeTitle } from 'js/commonUtils';

const ProjectStatus = () => {
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 30,
    limit: 9,
  });
  const [selectVal, setSelectVal] = useState('전체');
  const navigate = useNavigate();
  const statusArr = ['전체','시작 전', '진행 중', '종료'];

  useEffect(() => {
    changeTitle('그룹웨어 > 프로젝트 현황');
  }, []);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap'>
          <div className='header' onClick={() => window.location.reload()}>
            <h3>프로젝트 현황</h3>
          </div>
          <div className='selectArea column'>
            <hr />
            <div className='row'>
              <div className='row'>
                <span>프로젝트명</span>
                <input type='text' />
              </div>
              <div className='row'>
                <span>프로젝트 상태</span>
                <CommonSelect
                  opt={statusArr}
                  selectVal={selectVal}
                  setSelectVal={setSelectVal}
                />
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
                    <th>참여 인원</th>
                  </tr>
                </thead>
                <tbody>
                  {new Array(10).fill('').reduce((acc, i, idx) => {
                    return (
                      <>
                        {acc}
                        <tr className={idx % 2 === 1 ? 'odd' : 'even'}>
                          <td>{idx}</td>
                          <td>진행 중</td>
                          <td>그룹웨어</td>
                          <td>2022-12-09</td>
                          <td>2022-12-31</td>
                          <td>8명</td>
                        </tr>
                      </>
                    );
                  }, <></>)}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default ProjectStatus;
