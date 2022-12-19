import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Pagination from 'common/Pagination';
import SideMenu from 'common/SideMenu';
import { changeTitle } from 'js/commonUtils';
import PersonnelBusinessPopup from './PersonnelBusinessPopup';
import { getDepartmentInfo, getDepartmentList } from 'js/groupwareApi';

const PersonnelManagement = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentMeta, setDepartmentMeta] = useState({});
  const [curDepartment, setCurDepartment] = useState({});
  const [departmentPageInfo, setDepartmentPageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 6,
  });
  const [managePageInfo, setManagePageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 9,
  });
  const [popup, setPopup] = useState(false);
  const [buttonControl, setButtonControl] = useState('');
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    changeTitle('그룹웨어 > 인사 관리');
  }, []);
  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  let prevent = false;

  const getPersonDepartmentApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getDepartmentList(departmentPageInfo);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setDepartmentList(data);
      setDepartmentMeta(meta);
      setDepartmentPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    }
  };

  const getPersonDepartmentInfo = async id => {
    const result = await getDepartmentInfo(id);
    if (typeof result === 'object') {
      setCurDepartment(result?.data);
    }
  };
  console.log(curDepartment);
  useEffect(() => {
    getPersonDepartmentApi();
  }, [departmentPageInfo.page]);

  return (
    <>
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
              {departmentList.reduce((acc, cur, idx) => {
                return (
                  <>
                    {acc}
                    <li
                      className='card'
                      onClick={() => {
                        setPopup(true);
                        setButtonControl('수정');
                        getPersonDepartmentInfo(cur.id);
                      }}>
                      <div className='date-num'>
                        <span>
                          [{(departmentPageInfo.page - 1) * 5 + idx + 1}]
                        </span>
                        <span>{cur.created_at}</span>
                      </div>
                      <div className='team'>{cur.department_name}</div>
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
              <button
                className='commonBtn'
                onClick={() => {
                  setPopup(true);
                  setButtonControl('등록');
                }}>
                등록
              </button>
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

      {popup && (
        <PersonnelBusinessPopup
          popup={popup}
          setPopup={setPopup}
          buttonControl={buttonControl}
          setButtonControl={setButtonControl}
          curDepartment={curDepartment}
          setCurDepartment={setCurDepartment}
        />
      )}
    </>
  );
};

export default PersonnelManagement;
