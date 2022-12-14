import { useState } from 'react';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';
import { useNavigate } from 'react-router-dom';
import selectArrow from 'image/selectArrow.svg';

const BusinessManagement = () => {
  const [num, setNum] = useState(0);
  const [projectName, setProjectName] = useState('off');
  const [projectValue, setProjectValue] = useState('===');
  const [contactName, setContactName] = useState('off');
  const [contactValue, setContactValue] = useState('===');
  const [requesterName, setRequesterName] = useState('off');
  const [requesterValue, setRequesterValue] = useState('===');
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 15,
    limit: 9,
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

  return (
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
              <input type='radio' name='work' />
              <span>나의 업무현황</span>
            </label>
            <label className='work-bg'>
              <input type='radio' name='work' />
              <span>내가 요청한 업무</span>
            </label>
            <label className='work-bg'>
              <input type='radio' name='work' />
              <span>전체 업무현황</span>
            </label>
          </div>

          <div className='project-wrap'>
            {/* ============================= */}
            <div className='project-list'>
              <span>프로젝트</span>
              <div className={`selectBox ${projectName}`}>
                <div
                  className={`selectVal`}
                  onClick={() =>
                    projectName === 'on'
                      ? setProjectName('off')
                      : setProjectName('on')
                  }>
                  {projectValue}
                  <img src={selectArrow} alt='선택 아이콘' />
                </div>
                {projectName === 'on' && (
                  <div className='selectOptGroup'>
                    {projectNameArr.map((item, idx) => {
                      return (
                        <>
                          <div
                            className={`selectOpt ${
                              projectValue === item && 'active'
                            }`}
                            onClick={() => {
                              setProjectValue(item);
                              setProjectName('off');
                            }}
                            key={idx}>
                            {item}
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* ============================= */}
            <div className='project-list'>
              <span>담당자</span>
              <div className={`selectBox ${contactName}`}>
                <div
                  className={`selectVal`}
                  onClick={() =>
                    contactName === 'on'
                      ? setContactName('off')
                      : setContactName('on')
                  }>
                  {contactValue}
                  <img src={selectArrow} alt='선택 아이콘' />
                </div>
                {contactName === 'on' && (
                  <div className='selectOptGroup'>
                    {contactNameArr.map((item, idx) => {
                      return (
                        <>
                          <div
                            className={`selectOpt ${
                              contactValue === item && 'active'
                            }`}
                            onClick={() => {
                              setContactValue(item);
                              setContactName('off');
                            }}
                            key={idx}>
                            {item}
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* ============================= */}
            <div className='project-list'>
              <span>요청자</span>
              <div className={`selectBox ${requesterName}`}>
                <div
                  className={`selectVal`}
                  onClick={() =>
                    requesterName === 'on'
                      ? setRequesterName('off')
                      : setRequesterName('on')
                  }>
                  {requesterValue}
                  <img src={selectArrow} alt='선택 아이콘' />
                </div>
                {requesterName === 'on' && (
                  <div className='selectOptGroup'>
                    {contactNameArr.map((item, idx) => {
                      return (
                        <>
                          <div
                            className={`selectOpt ${
                              requesterValue === item && 'active'
                            }`}
                            onClick={() => {
                              setRequesterValue(item);
                              setRequesterName('off');
                            }}
                            key={idx}>
                            {item}
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='content'>
            <div className='title'>
              <label>
                <span>제목</span>
                <input type='text' placeholder='제목을 입력해주세요.' />
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

        <div className='check-work-wrap'>
          <div className='check-tab-list'>
            <div
              className={num === 0 ? 'my-check active' : 'my-check'}
              onClick={() => setNum(0)}>
              <span className={num === 0 ? 'active' : ''}>나의 업무현황</span>
              <div className={num === 0 ? 'num active' : 'num'}>0</div>
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
          </div>
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
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>안병욱</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>안병욱</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>안병욱</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>안병욱</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>안병욱</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
        </div>
      </div>
    </div>
  );
};

export default BusinessManagement;
