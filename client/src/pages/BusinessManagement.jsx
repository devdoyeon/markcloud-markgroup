import { useState } from 'react';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';

const BusinessManagement = () => {
  const [num, setNum] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 15,
    limit: 9,
  });

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
            <div className='project'>
              <span>프로젝트</span>
              <div>프로젝트명===</div>
            </div>
            <div>
              <span>담당자</span>
              <div>프로젝트명===</div>
            </div>
            <div>
              <span>요청자</span>
              <div>프로젝트명===</div>
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
              처리결과
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
            <div className='commonBtn create'>등록</div>
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
                  <th>담당자</th>
                  <th>중요도</th>
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
                    <td>중(2~3일)</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>중(2~3일)</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>중(2~3일)</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>중(2~3일)</td>
                    <td>완료</td>
                    <td>2022-12-09</td>
                    <td>2022-12-12</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>테스트제목</td>
                    <td>프로젝트1</td>
                    <td>김민지</td>
                    <td>중(2~3일)</td>
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
