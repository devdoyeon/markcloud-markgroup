import { useEffect, useState, useRef } from 'react';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';
import { useNavigate } from 'react-router-dom';
import CommonSelect from 'common/CommonSelect';
import BusinessCommonSelect from './BusinessCommonSelect';
import {
  getBusinessFilterRead,
  getBusinessInfo,
  getBusinessRead,
} from 'js/groupwareApi';
import CommonModal from 'common/CommonModal';
import { catchError, changeState, changeTitle } from 'js/commonUtils';
import { getCookie } from 'js/cookie';
import { useLocation } from 'react-router-dom';

const BusinessManagement = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [num, setNum] = useState(0);
  const [list, setList] = useState([]);
  const [metaData, setMetaData] = useState({});

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 0,
    limit: 10,
  });
  const [postInfo, setPostInfo] = useState({
    project_name: '',
    status_filter: localStorage.getItem('yn') === 'y' ? 'MyProject' : 'All',
    manager_id: '',
    request_id: '',
    title: '',
    content: '',
    progress_status: [],
  });

  const [projectValue, setProjectValue] = useState('선택');
  const [contactValue, setContactValue] = useState(
    localStorage.getItem('userName')
  );
  const [requesterValue, setRequesterValue] = useState(
    localStorage.getItem('userName')
  );
  const [memberKey, setMemberKey] = useState([]);
  const [memberName, setMemberName] = useState(['선택']);
  const [projectName, setProjectName] = useState(['선택']);
  const [memberCurKey, setMemberCurKey] = useState();

  const navigate = useNavigate();
  const path = useLocation().pathname;
  const pathname = path.split('/')[1];

  let prevent = false;

  const getBusinessReadApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);

    const result = await getBusinessRead(postInfo, pageInfo);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      // key : 키 value : 멤버이름
      const key = Object.keys(meta?.project_member);
      const value = Object.values(meta?.project_member);
      setMemberKey(['', ...key]);
      setMemberName(['선택', ...value]);
      setList(data);
      setMetaData(meta);
      if (projectName.length === 1) {
        setProjectName(prev => {
          const clone = [...prev];
          meta?.project_name.forEach(name => {
            clone.push(name);
          });
          return clone;
        });
      }
      // changeState(setPostInfo, 'project_name', projectValue);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const searchStart = async () => {
    // 여기 밑에서 api 요청
    await getBusinessReadApi();
  };

  const renderTable = () => {
    return list.length === 0 ? (
      <>
        <tr>
          <td colSpan={8}>등록된 게시글이 없습니다.</td>
        </tr>
      </>
    ) : (
      list?.reduce(
        (
          acc,
          {
            title,
            project_name,
            request_id,
            manager_id,
            work_status,
            created_at,
            work_end_date,
            id,
          },
          idx
        ) => {
          return (
            <>
              {acc}
              <tr
                onClick={() => navigate(`/business/${id}`)}
                className='table-row'>
                <td>{(pageInfo.page - 1) * 10 + idx + 1}</td>
                <td>{title}</td>
                <td>{project_name}</td>
                <td>{request_id}</td>
                <td>{manager_id}</td>
                <td
                  className={
                    work_status === '요청'
                      ? 'red'
                      : work_status === '완료'
                      ? 'gray'
                      : 'blue'
                  }>
                  {work_status}
                </td>
                <td>{created_at}</td>
                <td>{work_end_date}</td>
              </tr>
            </>
          );
        },
        <></>
      )
    );
  };

  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 업무 관리');
    }
  }, []);

  useEffect(() => {
    if (getCookie('myToken')) {
      if (localStorage.getItem('yn') === 'y') {
        getBusinessReadApi();
      } else if (localStorage.getItem('yn') === 'n') {
        getBusinessReadApi();
      }
    }
  }, [pageInfo.page]);

  useEffect(() => {
    if (getCookie('myToken')) {
      changeState(setPostInfo, 'project_name', projectValue);
    }
  }, [projectValue]);

  useEffect(() => {
    if (getCookie('myToken')) {
      changeState(setPostInfo, 'manager_id', memberCurKey);
    }
  }, [contactValue]);

  useEffect(() => {
    if (getCookie('myToken')) {
      changeState(setPostInfo, 'request_id', memberCurKey);
    }
  }, [requesterValue]);

  useEffect(() => {
    if (getCookie('myToken')) {
      if (postInfo.status_filter === 'MyProject') {
        setRequesterValue('선택');
        setContactValue(localStorage.getItem('userName'));
        changeState(setPostInfo, 'manager_id', '');
      } else if (postInfo.status_filter === 'MyRequest') {
        setContactValue('선택');
        setRequesterValue(localStorage.getItem('userName'));
        changeState(setPostInfo, 'request_id', '');
      } else if (postInfo.status_filter === 'All') {
        setContactValue('선택');
        setRequesterValue('선택');
      }
      getBusinessReadApi();
    }
  }, [postInfo.status_filter]);

  const handleChangeRadioButton = e => {
    changeState(setPostInfo, 'status_filter', e.target.value);
  };

  const changeCheckHandler = e => {
    switch (e.target.value) {
      case '요청':
        if (e.target.checked === true) {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status, e.target.value];
            return clone;
          });
        } else {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status].filter(
              state => state !== '요청'
            );
            return clone;
          });
        }
        break;
      case '접수':
        if (e.target.checked === true) {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status, e.target.value];
            return clone;
          });
        } else {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status].filter(
              state => state !== '접수'
            );
            return clone;
          });
        }
        break;
      case '진행':
        if (e.target.checked === true) {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status, e.target.value];
            return clone;
          });
        } else {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status].filter(
              state => state !== '진행'
            );
            return clone;
          });
        }
        break;
      case '완료':
        if (e.target.checked === true) {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status, e.target.value];
            return clone;
          });
        } else {
          setPostInfo(prev => {
            const clone = { ...prev };
            clone.progress_status = [...clone.progress_status].filter(
              state => state !== '완료'
            );
            return clone;
          });
        }
        break;
      default:
        return;
    }
  };

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap business'>
          <div className='header' onClick={() => window.location.reload()}>
            <h3>업무 관리</h3>
          </div>
          <div className='work-wrap'>
            <div className='work-situation'>
              <span>업무현황</span>
              {localStorage.getItem('yn') === 'y' ? (
                <>
                  <label className='work-bg'>
                    <input
                      type='radio'
                      name='work'
                      value='MyProject'
                      checked={postInfo.status_filter === 'MyProject'}
                      onChange={handleChangeRadioButton}
                    />
                    <span>나의 업무현황</span>
                  </label>
                  <label className='work-bg'>
                    <input
                      type='radio'
                      name='work'
                      value='MyRequest'
                      checked={postInfo.status_filter === 'MyRequest'}
                      onChange={handleChangeRadioButton}
                    />
                    <span>내가 요청한 업무</span>
                  </label>
                </>
              ) : (
                <></>
              )}
              {localStorage.getItem('yn') === 'n' ? (
                <label className='work-bg'>
                  <input
                    type='radio'
                    name='work'
                    value='All'
                    checked={postInfo.status_filter === 'All'}
                    onChange={handleChangeRadioButton}
                  />
                  <span>전체 업무현황</span>
                </label>
              ) : (
                <></>
              )}
            </div>

            <div className='project-wrap'>
              {/* ============================= */}
              <div className='project-list'>
                <span>프로젝트</span>
                <CommonSelect
                  opt={projectName && projectName}
                  selectVal={projectValue}
                  setSelectVal={setProjectValue}
                />
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>담당자</span>

                {postInfo.status_filter === 'MyProject' ? (
                  <BusinessCommonSelect
                    opt={memberName}
                    selectVal={contactValue}
                    setSelectVal={setContactValue}
                    postInfo={postInfo}
                    pathname={pathname}
                    nameKey={memberKey}
                    setMemberCurKey={setMemberCurKey}
                    filter='MyProject'
                    person='person'
                  />
                ) : postInfo.status_filter === 'MyRequest' ? (
                  <BusinessCommonSelect
                    opt={memberName}
                    selectVal={contactValue}
                    setSelectVal={setContactValue}
                    postInfo={postInfo}
                    pathname={pathname}
                    nameKey={memberKey}
                    setMemberCurKey={setMemberCurKey}
                    filter='MyRequest'
                    person='person'
                  />
                ) : postInfo.status_filter === 'All' ? (
                  <BusinessCommonSelect
                    opt={memberName}
                    selectVal={contactValue}
                    setSelectVal={setContactValue}
                    postInfo={postInfo}
                    pathname={pathname}
                    nameKey={memberKey}
                    setMemberCurKey={setMemberCurKey}
                    filter='All'
                    person='person'
                  />
                ) : (
                  <></>
                )}
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>요청자</span>
                {postInfo.status_filter === 'MyProject' ? (
                  <BusinessCommonSelect
                    opt={memberName}
                    selectVal={requesterValue}
                    setSelectVal={setRequesterValue}
                    postInfo={postInfo}
                    pathname={pathname}
                    nameKey={memberKey}
                    setMemberCurKey={setMemberCurKey}
                    filter='MyProject'
                    person='request'
                  />
                ) : postInfo.status_filter === 'MyRequest' ? (
                  <BusinessCommonSelect
                    opt={memberName}
                    selectVal={requesterValue}
                    setSelectVal={setRequesterValue}
                    postInfo={postInfo}
                    pathname={pathname}
                    nameKey={memberKey}
                    setMemberCurKey={setMemberCurKey}
                    filter='MyRequest'
                    person='request'
                  />
                ) : postInfo.status_filter === 'All' ? (
                  <BusinessCommonSelect
                    opt={memberName}
                    selectVal={requesterValue}
                    setSelectVal={setRequesterValue}
                    postInfo={postInfo}
                    pathname={pathname}
                    nameKey={memberKey}
                    setMemberCurKey={setMemberCurKey}
                    filter='All'
                    person='request'
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className='content'>
              <div className='title'>
                <label>
                  <span>제목</span>
                  <input
                    type='text'
                    placeholder='제목을 입력해 주세요.'
                    onChange={e =>
                      changeState(setPostInfo, 'title', e.target.value)
                    }
                  />
                </label>
              </div>
              <div className='content-text'>
                <label>
                  <span>내용</span>
                  <input
                    type='text'
                    placeholder='내용을 입력해주세요.'
                    onChange={e =>
                      changeState(setPostInfo, 'content', e.target.value)
                    }
                  />
                </label>
              </div>
            </div>
            <div className='progress'>
              <span>진행상태</span>
              <label>
                <input
                  type='checkbox'
                  name='progress-state'
                  value='요청'
                  onChange={e => changeCheckHandler(e)}
                />
                요청
              </label>
              <label>
                <input
                  type='checkbox'
                  name='progress-state'
                  value='접수'
                  onChange={e => changeCheckHandler(e)}
                />
                접수
              </label>
              <label>
                <input
                  type='checkbox'
                  name='progress-state'
                  value='진행'
                  onChange={e => changeCheckHandler(e)}
                />
                진행
              </label>
              <label>
                <input
                  type='checkbox'
                  name='progress-state'
                  value='완료'
                  onChange={e => changeCheckHandler(e)}
                />
                완료
              </label>
            </div>
            <div className='btnWrap work-btn-wrap'>
              <div></div>
              <div className='search-option'>
                <button
                  className='commonBtn search'
                  onClick={() => searchStart()}>
                  검색
                </button>
                <button className='commonBtn clear'>초기화</button>
              </div>
            </div>
          </div>
          <div className='work-table-wrap'>
            <div className='check-work-head-wrap'>
              <div className='check-work-title'>
                <h4>
                  {postInfo.status_filter === 'MyProject'
                    ? '나의 업무현황'
                    : postInfo.status_filter === 'MyRequest'
                    ? '내가 요청한 업무'
                    : postInfo.status_filter === 'All'
                    ? '전체 업무현황'
                    : ''}
                </h4>

                <div className='rect-num'>{metaData?.total_count}</div>
              </div>
              <div
                className='commonBtn create'
                onClick={() => navigate(`/business/write`)}>
                등록
              </div>
            </div>
            <div className='check-work-wrap'>
              <div className='table'>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>프로젝트</th>
                        <th>요청자</th>
                        <th>담당자</th>
                        <th>진행상태</th>
                        <th>요청일자</th>
                        <th>완료일자</th>
                      </tr>
                    </thead>
                    <tbody>{renderTable()}</tbody>
                  </table>
                </div>
              </div>
              <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
            </div>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/gp/sign-in');
          }}
        />
      )}
    </>
  );
};

export default BusinessManagement;
