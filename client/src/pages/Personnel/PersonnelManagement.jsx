import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from 'common/Pagination';
import SideMenu from 'common/SideMenu';
import { addHypen, changeTitle } from 'js/commonUtils';
import PersonnelBusinessPopup from './PersonnelBusinessPopup';
import noneImg from 'image/noneList.svg';
import {
  getDepartmentInfo,
  getDepartmentList,
  getMemberList,
} from 'js/groupwareApi';
import { getCookie } from 'js/cookie';

const PersonnelManagement = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentMeta, setDepartmentMeta] = useState({});
  const [curDepartment, setCurDepartment] = useState('');
  const [departmentPageInfo, setDepartmentPageInfo] = useState({
    page: 1,
    totalPage: 0,
    limit: 6,
  });
  const [manageList, setManageList] = useState([]);
  const [manageMeta, setManageMeta] = useState({});
  const [managePageInfo, setManagePageInfo] = useState({
    page: 1,
    totalPage: 0,
    limit: 10,
  });
  const [popup, setPopup] = useState(false);
  const [buttonControl, setButtonControl] = useState('');

  const cookie = getCookie('myToken');

  useEffect(() => {
    changeTitle('그룹웨어 > 인사 관리');
  }, []);
  const navigate = useNavigate();

  let prevent = false;
  let prevent2 = false;

  const getPersonDepartmentApi = async pageCon => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 300);
    const result = await getDepartmentList(departmentPageInfo, pageCon);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setDepartmentList(prev => {
        const clone = [...data];
        return clone;
      });
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

  const getPersonMemberApi = async () => {
    if (prevent2) return;
    prevent2 = true;
    setTimeout(() => {
      prevent2 = false;
    }, 200);
    const result = await getMemberList(managePageInfo, cookie);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setManageList(data);
      setManageMeta(meta);
      setManagePageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    }
  };
  const renderTable = () => {
    return manageList.length === 0 ? (
      <>
        <tr>
          <td colSpan={7} className='none-list'>
            등록된 계정이 없습니다
          </td>
        </tr>
      </>
    ) : (
      manageList?.reduce(
        (acc, { id, user_id, name, section, phone, email, birthday }, idx) => {
          return (
            <>
              {acc}
              <tr onClick={() => navigate(`/gp/personnel/write/${id}`)}>
                <td>{(managePageInfo.page - 1) * 10 + idx + 1}</td>
                <td>{user_id}</td>
                <td>{name}</td>
                <td>{section}</td>
                <td>{addHypen(phone)}</td>
                <td>{email}</td>
                <td>{birthday}</td>
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
      getPersonDepartmentApi();
    }
  }, [departmentPageInfo.page]);

  useEffect(() => {
    if (getCookie('myToken')) getPersonMemberApi();
  }, [managePageInfo.page]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap personnel'>
          <div className='header' onClick={() => window.location.reload()}>
            <h3>인사 관리</h3>
          </div>
          <div className='department-manage-wrap'>
            <div className='head'>
              <div className='rect'>부서관리</div>
              <div className='line'></div>
            </div>
            {departmentList.length === 0 ? (
              <div className='no-img-wrap'>
                <img src={noneImg} alt='부서 없음' />
                <span>등록 된 부서가 없습니다.</span>
              </div>
            ) : (
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
                            [{(departmentPageInfo.page - 1) * 6 + idx + 1}]
                          </span>
                          <span>{cur.created_at}</span>
                        </div>
                        <div className='team'>{cur.section}</div>
                      </li>
                    </>
                  );
                }, [])}
              </ul>
            )}

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
                    <tr>
                      <th>번호</th>
                      <th>아이디</th>
                      <th>성명</th>
                      <th>소속</th>
                      <th>휴대전화</th>
                      <th>이메일</th>
                      <th>생년월일</th>
                    </tr>
                  </thead>
                  <tbody>{renderTable()}</tbody>
                </table>
              </div>
            </div>
            <div className='page-wrap'>
              <Pagination
                pageInfo={managePageInfo}
                setPageInfo={setManagePageInfo}
              />
              <button
                className='commonBtn'
                onClick={() => navigate('/gp/personnel/write')}>
                등록
              </button>
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
          getPersonDepartmentApi={getPersonDepartmentApi}
          departmentList={departmentList}
          departmentPageInfo={departmentPageInfo}
          setDepartmentPageInfo={setDepartmentPageInfo}
        />
      )}
    </>
  );
};

export default PersonnelManagement;
