import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import Pagination from 'common/Pagination';
import { changeTitle, changeState } from 'js/commonUtils';
import { getProjectList } from 'js/groupwareApi';

const ProjectStatus = () => {
  const date = new Date();
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 1,
    limit: 10,
  });
  const [selectVal, setSelectVal] = useState('전체');
  const [list, setList] = useState([]);
  const [search, setSearch] = useState({
    name: '',
    start_date: `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`,
    end_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  });
  const navigate = useNavigate();
  const statusArr = ['전체', '시작 전', '진행 중', '종료'];
  const eng2kor = {
    all: '전체',
    before: '시작 전',
    ongoing: '진행 중',
    complete: '종료',
  };
  let prevent = false;

  const projectList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getProjectList();
    if (typeof result === 'object') {
      setList(result?.data?.data);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.totalPage = result?.data?.meta?.totalPage;
        clone.page = result?.data?.meta?.page;
        return clone;
      });
    }
  };

  const renderTable = () => {
    return list?.reduce(
      (
        acc,
        {
          id,
          project_status,
          project_name,
          project_start_date,
          project_end_date,
          member_cnt,
        },
        idx
      ) => {
        return (
          <>
            {acc}
            <tr
              className={idx % 2 === 1 ? 'odd' : 'even'}
              onClick={() => navigate(`/project/${id}`)}>
              <td>{idx + 1}</td>
              <td>{eng2kor[project_status]}</td>
              <td>{project_name}</td>
              <td>{project_start_date}</td>
              <td>{project_end_date}</td>
              <td>{member_cnt}</td>
            </tr>
          </>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 프로젝트 현황');
    projectList();
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
                <input
                  type='text'
                  placeholder='프로젝트명을 입력해 주세요.'
                  value={search.name}
                  onChange={e => changeState(setSearch, 'name', e.target.value)}
                />
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
                <input
                  type='date'
                  value={search.start_date}
                  onChange={e =>
                    changeState(setSearch, 'start_date', e.target.value)
                  }
                />
              </div>
              <div className='row'>
                <span>프로젝트 종료일</span>
                <input
                  type='date'
                  value={search.end_date}
                  onChange={e =>
                    changeState(setSearch, 'end_date', e.target.value)
                  }
                />
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
                <tbody>{renderTable()}</tbody>
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
