import { useEffect, useState } from 'react';
import Pagination from 'common/Pagination';
import SideMenu from 'common/SideMenu';

const PersonnelManagement = () => {
  const [departmentPageInfo, setDepartmentPageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 9,
  });
  const [managePageInfo, setManagePageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 9,
  });
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap personnel'>
        <div className='header'>
          <h3>인사 관리</h3>
        </div>
        <div className='department-manage-wrap'>
          <div className='head'>
            <div className='rect'>부서관리</div>
            <div className='line'></div>
          </div>
          <ul className='card-wrap'>
            {arr.reduce((acc, cur) => {
              return (
                <>
                  {acc}
                  <li className='card'>
                    <div className='date-num'>
                      <span>[1]</span>
                      <span>2022.12.13</span>
                    </div>
                    <div className='team'>AI분석 및 모델링팀</div>
                  </li>
                </>
              );
            }, [])}
          </ul>
          <div className='page-wrap'>
            <Pagination
              pageInfo={departmentPageInfo}
              setPageInfo={setDepartmentPageInfo}
            />
            <button className='commonBtn'>등록</button>
          </div>
        </div>
        <div className='member-manage-wrap'>
          <div className='head'>
            <div className='rect'>인사관리</div>
            <div className='line'></div>
          </div>
          <div className='table'>
            <div>
              <table>
                <thead>
                  <th>번호</th>
                  <th>아이디</th>
                  <th>성명</th>
                  <th>소속</th>
                  <th>휴대전화</th>
                  <th>이메일</th>
                  <th>입사일</th>
                  <th>생년월일</th>
                </thead>
                <tbody>
                  {arr.reduce((acc, cur, idx) => {
                    return (
                      <>
                        {acc}
                        <tr>
                          <td>{(managePageInfo.page - 1) * 10 + idx + 1}</td>
                          <td>케로로</td>
                          <td>권도연</td>
                          <td>SI팀</td>
                          <td>010-1234-5678</td>
                          <td>info@markcloud.co.kr</td>
                          <td>2022-06-20</td>
                          <td>2022-11-26</td>
                        </tr>
                      </>
                    );
                  }, [])}
                </tbody>
              </table>
            </div>
          </div>
          <div className='page-wrap'>
            <Pagination
              pageInfo={managePageInfo}
              setPageInfo={setManagePageInfo}
            />
            <button className='commonBtn'>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelManagement;
