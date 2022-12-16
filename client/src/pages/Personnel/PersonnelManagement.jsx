import { useEffect, useState } from 'react';
import Pagination from 'common/Pagination';
import SideMenu from 'common/SideMenu';

const PersonnelManagement = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 9,
  });
  const arr = [1, 2, 3, 4, 5, 6];
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
            <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
            <button className='commonBtn'>등록</button>
          </div>
        </div>
        <div className='member-manage-wrap'>
          <div className='head'>
            <div className='rect'>인사관리</div>
            <div className='line'></div>
          </div>
          <div className="table">

          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelManagement;
