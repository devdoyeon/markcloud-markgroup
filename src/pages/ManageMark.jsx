import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import Pagination from 'common/Pagination';
import { changeTitle, catchError, changeState } from 'js/commonUtils';
import { getMarkList, searchMark } from 'js/groupwareApi';
import noneList from 'image/noneList.svg';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';

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
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  let prevent = false;
  const [rights2, setRights2] = useState('전체');
  const [appInput1, setAppInput1] = useState('');
  const [appInput2, setAppInput2] = useState('');
  const [appInput3, setAppInput3] = useState('');
  const [regInput1, setRegInput1] = useState('');
  const [regInput2, setRegInput2] = useState('');
  const [regInput3, setRegInput3] = useState('');
  const [regInput4, setRegInput4] = useState('');
  const rights = ['전체', '특허', '디자인', '상표'];

  const [inputData, setInputData] = useState({
    rights: 'all',
    application_number: '',
    application_start_date: '',
    application_end_date: '',
    applicant: '',
    name_kor: '',
    product_code: '',
    registration_number: '',
    registration_start_date: '',
    registration_end_date: '',
  });

  useEffect(() => {
    changeTitle('그룹웨어 > 지식재산권 관리');
  }, []);

  useEffect(() => {
    if (rights2 === '전체') changeState(setInputData, 'rights', 'all');
    else if (rights2 === '특허') changeState(setInputData, 'rights', 'patent');
    else if (rights2 === '디자인')
      changeState(setInputData, 'rights', 'design');
    else if (rights2 === '상표') changeState(setInputData, 'rights', 'mark');
  }, [rights2]);

  useEffect(() => {
    if (
      appInput1.length === 2 &&
      appInput2.length === 4 &&
      appInput3.length === 7
    ) {
      let appInput = appInput1 + appInput2 + appInput3;

      changeState(setInputData, 'application_number', appInput);
    }
    if (
      regInput1.length === 2 &&
      regInput2.length === 7 &&
      regInput3.length === 2 &&
      regInput4.length === 2
    ) {
      let regInput = regInput1 + regInput2 + regInput3 + regInput4;
      changeState(setInputData, 'registration_number', regInput);
    }
  }, [appInput3, appInput1, appInput2, regInput1, regInput2]);

  const searchFunc = async () => {
    const result = await searchMark(inputData);
    if (typeof result === 'object') {
      setList(result?.data?.data);
      changeState(setPageInfo, 'totalPage', result?.data?.meta?.totalPage);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };
  const clearFunc = async () => {
    setAppInput1('');
    setAppInput2('');
    setAppInput3('');
    setRegInput1('');
    setRegInput2('');
    setInputData({
      rights: 'all',
      application_number: '',
      application_start_date: '',
      application_end_date: '',
      applicant: '',
      name_kor: '',
      product_code: '',
      registration_number: '',
      registration_start_date: '',
      registration_end_date: '',
    });
    setPageInfo({
      page: 1,
      totalPage: 0,
      limit: 10,
    });
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
          ip_status,
          product_code,
          registration_number,
          registration_date,
        },
        idx
      ) => {
        const eng2kor = txt => {
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
              <td>{eng2kor(rights)}</td>
              <td>{name_kor}</td>
              <td>{application_number}</td>
              <td>{application_date}</td>
              <td>{applicant}</td>
              <td>{eng2kor(ip_status)}</td>
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
            <>
              <div className='manage-search-wrap'>
                <ul className='search-form'>
                  <li>
                    <div className='after-div'>
                      <span>권리</span>
                      <CommonSelect
                        opt={rights}
                        selectVal={rights2}
                        setSelectVal={setRights2}
                      />
                    </div>
                    <div>
                      <span>출원번호</span>
                      <div className='input-wrap'>
                        <input
                          type='text'
                          className='appNum-input'
                          placeholder='00'
                          maxLength='2'
                          value={appInput1}
                          onChange={e => {
                            setAppInput1(e.target.value);
                          }}
                        />
                        {' - '}
                        <input
                          type='text'
                          className='appNum-input'
                          maxLength='4'
                          placeholder='0000'
                          value={appInput2}
                          onChange={e => {
                            setAppInput2(e.target.value);
                          }}
                        />
                        {' - '}
                        <input
                          type='text'
                          className='appNum-input'
                          maxLength='7'
                          placeholder='0000000'
                          value={appInput3}
                          onChange={e => {
                            setAppInput3(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className='after-div'>
                      <span>출원일</span>
                      <div className='input-wrap'>
                        <input
                          type='date'
                          className='date-input first'
                          max='9999-12-31'
                          value={inputData?.application_start_date}
                          onChange={e => {
                            changeState(
                              setInputData,
                              'application_start_date',
                              e.target.value
                            );
                          }}
                        />
                        {' - '}
                        <input
                          type='date'
                          className='date-input last'
                          max='9999-12-31'
                          value={inputData?.application_end_date}
                          onChange={e => {
                            changeState(
                              setInputData,
                              'application_end_date',
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <span>출원인</span>
                      <div className='input-wrap'>
                        <input
                          type='text'
                          placeholder='성명을 입력해주세요.'
                          className='default'
                          value={inputData?.applicant}
                          onChange={e => {
                            changeState(
                              setInputData,
                              'applicant',
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span>국문명칭</span>
                      <div className='input-wrap'>
                        <input
                          type='text'
                          placeholder='국문명칭을 입력해주세요.'
                          className='kr-name'
                          value={inputData?.name_kor}
                          onChange={e => {
                            changeState(
                              setInputData,
                              'name_kor',
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div>
                      <span>상품류</span>
                      <div className='input-wrap'>
                        <input
                          type='text'
                          placeholder='상품류를 입력해주세요.'
                          className='default'
                          value={inputData?.product_code}
                          onChange={e => {
                            changeState(
                              setInputData,
                              'product_code',
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className='after-div'>
                      <span>등록일</span>
                      <div className='input-wrap'>
                        <input
                          type='date'
                          className='date-input first'
                          max='9999-12-31'
                          value={inputData?.registration_start_date}
                          onChange={e => {
                            changeState(
                              setInputData,
                              'registration_start_date',
                              e.target.value
                            );
                          }}
                        />
                        {' - '}
                        <input
                          type='date'
                          className='date-input last'
                          max='9999-12-31'
                          value={inputData?.registration_end_date}
                          onChange={e => {
                            changeState(
                              setInputData,
                              'registration_end_date',
                              e.target.value
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <span>등록번호</span>
                      <div className='input-wrap'>
                        <input
                          type='text'
                          className='reg-input'
                          placeholder='00'
                          maxLength='2'
                          value={regInput1}
                          onChange={e => {
                            setRegInput1(e.target.value);
                          }}
                        />
                        {' - '}
                        <input
                          type='text'
                          className='reg-input'
                          placeholder='0000000'
                          maxLength='7'
                          value={regInput2}
                          onChange={e => {
                            setRegInput2(e.target.value);
                          }}
                        />
                        {' - '}
                        <input
                          type='text'
                          className='reg-input'
                          placeholder='00'
                          maxLength='2'
                          value={regInput3}
                          onChange={e => {
                            setRegInput3(e.target.value);
                          }}
                        />
                        {' - '}
                        <input
                          type='text'
                          className='reg-input'
                          placeholder='00'
                          maxLength='2'
                          value={regInput4}
                          onChange={e => {
                            setRegInput4(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <div className='btn-wrap'>
                  <button
                    className='commonBtn applyBtn'
                    onClick={() => searchFunc()}>
                    검색
                  </button>
                  <button
                    className='commonBtn clear'
                    onClick={() => clearFunc()}>
                    초기화
                  </button>
                </div>
              </div>
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
              </div>
            </>
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
