import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import Pagination from 'common/Pagination';
import { changeTitle, catchError } from 'js/commonUtils';
import { getMarkList } from 'js/groupwareApi';
import noneList from 'image/noneList.svg';
import CommonModal from 'common/CommonModal';

const ManageMark = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 0,
    limit: 10,
  });
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  // const arr = [{status: '진행중'}]
  const navigate = useNavigate();
  let prevent = false;

  useEffect(() => {
    changeTitle('그룹웨어 > 지식재산권 관리');
  }, []);

  const renderTable = () => {
    return list?.reduce(
      (
        acc,
        {
          id,
          rights,
          name_kor,
          application_number,
          application_date,
          applicant,
          status,
          product_code,
          registration_number,
          registration_date,
        },
        idx
      ) => {
        const eng2Kor = txt => {
          switch (txt) {
            case 'patent':
              return '특허';
            case 'design':
              return '디자인';
            case 'mark':
              return '상표';
            case 'application':
              return '출원';
            case 'decide':
              return '심사중';
            case 'opinionNotice':
              return '의견제출통지';
            case 'apply':
              return '등록';
            default:
              return;
          }
        };

        return (
          <>
            {acc}
            <tr
              className={idx % 2 === 1 ? 'odd' : 'even'}
              onClick={() => navigate(`/mark-group/manage-mark/${id}`)}>
              <td>{idx + 1}</td>
              <td>{eng2Kor(rights)}</td>
              <td>{name_kor}</td>
              <td>{application_number}</td>
              <td>{application_date}</td>
              <td>{applicant}</td>
              <td>{eng2Kor(status)}</td>
              <td>{product_code}</td>
              <td>{registration_number}</td>
              <td>{registration_date}</td>
            </tr>
          </>
        );
      },
      <></>
    );
  };

  const getList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getMarkList(pageInfo);
    if (typeof result === 'object') {
      setList(result?.data?.data);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.totalPage = result?.data?.meta?.totalPage;
        return clone;
      });
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    getList();
  }, [pageInfo?.page]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap manageMark'>
          <CommonHeader />
          {list?.length <= 0 ? (
            <div className='noneList column'>
              <img src={noneList} alt='' />
              <span>등록된 지식재산이 없습니다.</span>
            </div>
          ) : (
            <div className='table-wrap'>
              <div className='table'>
                <table>
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>권리</th>
                      <th>국문</th>
                      <th>출원번호</th>
                      <th>출원일</th>
                      <th>출원인</th>
                      <th>상태</th>
                      <th>상품류</th>
                      <th>등록번호</th>
                      <th>등록일</th>
                    </tr>
                  </thead>
                  <tbody>{renderTable()}</tbody>
                </table>
              </div>
              {/* )} */}
            </div>
          )}
          <div className='bottom-wrap'>
            <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
            <button
              className='commonBtn applyBtn'
              onClick={() => navigate('/mark-group/manage-mark/add')}>
              등록
            </button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'duplicateLogin')
              return navigate('/mark-group/sign-in');
            else if (alert === 'tokenExpired') navigate('/mark-group/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default ManageMark;
