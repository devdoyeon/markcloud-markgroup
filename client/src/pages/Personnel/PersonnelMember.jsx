import { useEffect, useState } from 'react';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';
import { useNavigate } from 'react-router-dom';
import CommonSelect from 'common/CommonSelect';
import { getDepartmentList, getBusinessRead } from 'js/groupwareApi';
import CommonModal from 'common/CommonModal';
import { catchError, changeTitle } from 'js/commonUtils';
import PostCode from './PostCode';

const PersonnelMember = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [num, setNum] = useState(0);
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({});
  const [departmentName, setDepartmentName] = useState([]);

  const [departmentList, setDepartmentList] = useState([]);
  const [departmentMeta, setDepartmentMeta] = useState({});

  const [inputVal, setInputVal] = useState('나의 업무현황');
  const [contactValue, setContactValue] = useState('===');
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 15,
    limit: 5,
  });
  const [departmentPageInfo, setDepartmentPageInfo] = useState({
    page: 1,
    totalPage: 9,
    limit: 6,
  });
  const [inputValue, setInputValue] = useState('');

  //팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //주소 관련 state
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState(''); //상세주소
  const [writeAddress, setWriteAddress] = useState(''); //사용자가 입력하는 상세주소

  const navigate = useNavigate();

  const projectNameArr = [
    '마크클라우드',
    '마크뷰',
    '마크통',
    '마크링크',
    '삼성전자',
    '그린터치',
  ];

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
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].department_name);
        setDepartmentName(name => [...name, data[i].department_name]);
      }
      setDepartmentPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    }
  };

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
    changeTitle('그룹웨어 > 인사 관리');
    getPersonDepartmentApi();
  }, []);

  useEffect(() => {
    getProjectApi();
  }, [pageInfo.page]);

  useEffect(() => {
    if (inputValue.length === 10) {
      setInputValue(inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
    }
    if (inputValue.length === 13) {
      setInputValue(
        inputValue
          .replace(/-/g, '')
          .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
      );
    }
  }, [inputValue]);

  const handleChange = e => {
    const regex = /^[0-9\b -]{0,13}$/;
    if (regex.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap member'>
          <div className='header'>
            <h3>인사 관리</h3>
          </div>
          <div className='member-wrap'>
            <div className='id-line'>
              <div>
                <span>아이디</span>
                <input type='text' autocomplete='off' />
              </div>
              <div className='name'>
                <span>성명</span>
                <input type='text' autocomplete='off' />
              </div>
              <div className='gender-wrap'>
                <span>성별</span>
                <div className='gender-input-wrap'>
                  <div>
                    <input type='radio' name='gender' />
                    <span>남</span>
                  </div>

                  <div>
                    <input type='radio' name='gender' />
                    <span>여</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='date-line'>
              <div className='birth-date'>
                <span>생년월일</span>
                <input type='date' />
              </div>
              <div className='affiliation'>
                <span>소속</span>
                <CommonSelect
                  opt={departmentName}
                  selectVal={contactValue}
                  setSelectVal={setContactValue}
                />
              </div>
              <div className='password'>
                <span>비밀번호</span>
                <input type='password' autocomplete='off' />
              </div>
            </div>
            <div className='phone-line'>
              <div>
                <span>휴대전화</span>
                <input
                  type='text'
                  onChange={handleChange}
                  value={inputValue}
                  autocomplete='off'
                />
              </div>
              <div>
                <span>이메일</span>
                <input type='text' autocomplete='off' />
              </div>
            </div>
            <div className='address-line'>
              <span>주소</span>
              <input
                type='text'
                placeholder='주소 입력'
                value={addressDetail}
                autocomplete='off'
                onChange={e => setAddressDetail(e.target.value)}
              />
              <button
                className='commonBtn'
                onClick={() => setIsPopupOpen(true)}>
                주소찾기
              </button>
            </div>
          </div>
          <div className='btn-wrap'>
            <button className='commonBtn'>수정</button>
            <button className='commonBtn delete'>삭제</button>
            <button className='commonBtn list'>목록</button>
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
      {isPopupOpen ? (
        <PostCode
          onClose={() => setIsPopupOpen(false)}
          setAddress={setAddress}
          setAddressDetail={setAddressDetail}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default PersonnelMember;
