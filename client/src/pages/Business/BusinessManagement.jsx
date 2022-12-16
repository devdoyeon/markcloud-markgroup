import { useEffect, useState } from 'react';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';
import { useNavigate } from 'react-router-dom';
import CommonSelect from 'common/CommonSelect';
import { getBusinessRead } from 'js/groupwareApi';
import CommonModal from 'common/CommonModal';
import { catchError, changeTitle } from 'js/commonUtils';

const BusinessManagement = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [num, setNum] = useState(0);
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({});
  const [inputVal, setInputVal] = useState('나의 업무현황');
  const [projectValue, setProjectValue] = useState('===');
  const [contactValue, setContactValue] = useState('===');
  const [requesterValue, setRequesterValue] = useState('===');
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 15,
    limit: 5,
  });

  const navigate = useNavigate();

  const projectNameArr = [
    '마크클라우드',
    '마크뷰',
    '마크통',
    '마크링크',
    '삼성전자',
    '그린터치',
  ];

  const contactNameArr = ['안병욱', '송지은', '권정인', '강은수', '권도연'];

  let prevent = false;

  const getProjectApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getBusinessRead(pageInfo);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setList(data);
      setMeta(meta);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 업무 관리');
  }, []);

  useEffect(() => {
    getProjectApi();
  }, [pageInfo.page]);

  const handleChangeRadioButton = e => {
    setInputVal(e.target.value);
  };

  const handleChangeClear = () => {};

  const { project_member, project_name } = meta;

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap business'>
          <div className='header'>
            <h3>업무 관리</h3>
          </div>
          <div className='work-wrap'>
            <div className='work-situation'>
              <span>업무현황</span>
              <label className='work-bg'>
                <input
                  type='radio'
                  name='work'
                  value='나의 업무현황'
                  checked={inputVal === '나의 업무현황'}
                  onChange={handleChangeRadioButton}
                />
                <span>나의 업무현황</span>
              </label>
              <label className='work-bg'>
                <input
                  type='radio'
                  name='work'
                  value='내가 요청한 업무'
                  checked={inputVal === '내가 요청한 업무'}
                  onChange={handleChangeRadioButton}
                />
                <span>내가 요청한 업무</span>
              </label>
              <label className='work-bg'>
                <input
                  type='radio'
                  name='work'
                  value='전체 업무현황'
                  checked={inputVal === '전체 업무현황'}
                  onChange={handleChangeRadioButton}
                />
                <span>전체 업무현황</span>
              </label>
            </div>

            <div className='project-wrap'>
              {/* ============================= */}
              <div className='project-list'>
                <span>프로젝트</span>
                <CommonSelect
                  opt={project_name}
                  selectVal={projectValue}
                  setSelectVal={setProjectValue}
                />
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>담당자</span>
                <CommonSelect
                  opt={project_member}
                  selectVal={contactValue}
                  setSelectVal={setContactValue}
                />
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>요청자</span>
                <CommonSelect
                  opt={project_member}
                  selectVal={requesterValue}
                  setSelectVal={setRequesterValue}
                />
              </div>
            </div>
            <div className='content'>
              <div className='title'>
                <label>
                  <span>제목</span>
                  <input type='text' placeholder='제목을 입력해 주세요.' />
                </label>
              </div>
              <div className='content-text'>
                <label>
                  <span>내용</span>
                  <input type='text' placeholder='내용을 입력해주세요.' />
                </label>
              </div>
            </div>
            <div className='progress'>
              <span>진행상태</span>
              <label>
                <input type='checkbox' />
                요청
              </label>
              <label>
                <input type='checkbox' />
                접수
              </label>
              <label>
                <input type='checkbox' />
                진행
              </label>
              <label>
                <input type='checkbox' />
                완료
              </label>
            </div>
            <div className='btnWrap work-btn-wrap'>
              <div></div>
              <div className='search-option'>
                <button className='commonBtn search'>검색</button>
                <button className='commonBtn clear'>초기화</button>
              </div>
              <div
                className='commonBtn create'
                onClick={() => navigate(`/business/write`)}>
                등록
              </div>
            </div>
          </div>
          <div className='work-table-wrap'>
            <div className='check-work-head-wrap'>
              <div className='check-work-title'>
                <h4>내가 요청한 업무</h4>
                <div className='rect-num'>{list.length}</div>
              </div>
              <div className='line'></div>
            </div>
            <div className='check-work-wrap'>
              {/* <div className='check-tab-list'>
            <div
              className={num === 0 ? 'my-check active' : 'my-check'}
              onClick={() => setNum(0)}>
              <span className={num === 0 ? 'active' : ''}>나의 업무현황</span>
              <div className={num === 0 ? 'num active' : 'num'}>
                {list.length}
              </div>
            </div>
            <div
              className={num === 1 ? 'request-check active' : 'request-check'}
              onClick={() => setNum(1)}>
              <span className={num === 1 ? 'active' : ''}>
                내가 요청한 업무
              </span>
              <div className={num === 1 ? 'num active' : 'num'}>0</div>
            </div>
            <div
              className={num === 2 ? 'all-check active' : 'all-check'}
              onClick={() => setNum(2)}>
              <span className={num === 2 ? 'active' : ''}>전체 업무현황</span>
              <div className={num === 2 ? 'num active' : 'num'}>0</div>
            </div>
          </div> */}
              <div className='table'>
                <div>
                  <table>
                    <thead>
                      <th>번호</th>
                      <th>제목</th>
                      <th>프로젝트</th>
                      <th>요청자</th>
                      <th>담당자</th>
                      <th>진행상태</th>
                      <th>요청일자</th>
                      <th>완료일자</th>
                    </thead>
                    <tbody>
                      {list.reduce((acc, cur, idx) => {
                        return (
                          <>
                            {acc}
                            <tr>
                              <td>{(pageInfo.page - 1) * 5 + idx + 1}</td>
                              <td>{cur.title}</td>
                              <td>{cur.project_name}</td>
                              <td>{cur.request_id}</td>
                              <td>{cur.manager_id}</td>
                              <td>{cur.work_status}</td>
                              <td>{cur.created_at}</td>
                              <td>{cur.work_end_date}</td>
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

export default BusinessManagement;
