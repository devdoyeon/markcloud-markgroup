import { useContext, useEffect, useState } from 'react';
import SideMenu from 'common/SideMenu';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import CommonSelect from 'common/CommonSelect';
import {
  getDepartmentList,
  getBusinessRead,
  getMemberCreate,
} from 'js/groupwareApi';
import CommonModal from 'common/CommonModal';
import {
  catchError,
  changeState,
  changeTitle,
  commonModalSetting,
} from 'js/commonUtils';
import PostCode from './PostCode';
import { getCookie } from 'js/cookie';

const PersonnelMember = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  // 이름,아이디,비밀번호,이메일,생일,휴대폰,성별,우편번호,주소,소속
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    user_id: '',
    password: '',
    email: '',
    birthday: '',
    phone: '',
    gender: '',
    zip_code: '',
    address: '',
    section: '',
  });
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

  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  const cookie = getCookie('myToken');

  let prevent = false;

  const getPersonDepartmentApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getDepartmentList(departmentPageInfo, cookie);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setDepartmentList(data);
      setDepartmentMeta(meta);
      for (let i = 0; i < data.length; i++) {
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

  // const getProjectApi = async () => {
  //   if (prevent) return;
  //   prevent = true;
  //   setTimeout(() => {
  //     prevent = false;
  //   }, 200);
  //   const result = await getBusinessRead(pageInfo);
  //   if (typeof result === 'object') {
  //     const { data, meta } = result?.data;
  //     setList(data);
  //     setMeta(meta);
  //     setPageInfo(prev => {
  //       const clone = { ...prev };
  //       clone.page = meta?.page;
  //       clone.totalPage = meta?.totalPage;
  //       return clone;
  //     });
  //   } else return catchError(result, navigate, setAlertBox, setAlert);
  // };

  const createMember = async () => {
    //유효성 검사

    // --
    const result = await getMemberCreate(memberInfo, cookie);
    if (typeof result === 'object') {
      setAlert('apply');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '등록이 완료되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert); // 에러 처리
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 인사 관리');
    getPersonDepartmentApi();
  }, []);

  // useEffect(() => {
  //   getProjectApi();
  // }, [pageInfo.page]);

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
    changeState(setMemberInfo, 'phone', inputValue);
  }, [inputValue]);
  useEffect(() => {
    changeState(setMemberInfo, 'section', contactValue);
  }, [contactValue]);

  // 주소 검색
  useEffect(() => {
    if (!isPopupOpen) {
      changeState(setMemberInfo, 'address', addressDetail);
      changeState(setMemberInfo, 'zip_code', address);
    }
  }, [isPopupOpen]);
  const phoneNumRegex = e => {
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
                <input
                  type='text'
                  value={memberInfo.user_id}
                  autoComplete='off'
                  placeholder='아이디를 입력해주세요.'
                  onChange={e =>
                    changeState(setMemberInfo, 'user_id', e.target.value)
                  }
                />
                <button className='commonBtn'>중복체크</button>
              </div>
            </div>
            <div className='name-line'>
              <div className='name'>
                <span>성명</span>
                <input
                  type='text'
                  value={memberInfo.name}
                  placeholder='성명을 입력해주세요.'
                  autoComplete='off'
                  onChange={e =>
                    changeState(setMemberInfo, 'name', e.target.value)
                  }
                />
              </div>
              <div className='gender-wrap'>
                <span>성별</span>
                <div className='gender-input-wrap'>
                  <div>
                    <input
                      type='radio'
                      name='gender'
                      autoComplete='off'
                      data-gender='male'
                      onClick={e =>
                        changeState(
                          setMemberInfo,
                          'gender',
                          e.target.dataset.gender
                        )
                      }
                    />
                    <span>남</span>
                  </div>

                  <div>
                    <input
                      type='radio'
                      name='gender'
                      autoComplete='off'
                      data-gender='female'
                      onClick={e =>
                        changeState(
                          setMemberInfo,
                          'gender',
                          e.target.dataset.gender
                        )
                      }
                    />
                    <span>여</span>
                  </div>
                </div>
              </div>
              <div className='birth-date'>
                <span>생년월일</span>
                <input
                  type='date'
                  autoComplete='off'
                  onChange={e =>
                    changeState(setMemberInfo, 'birthday', e.target.value)
                  }
                />
              </div>
            </div>

            <div className='affiliation-line'>
              <div className='affiliation'>
                <span>소속</span>
                <CommonSelect
                  opt={departmentName}
                  selectVal={contactValue}
                  setSelectVal={setContactValue}
                />
              </div>
              <div className='phone'>
                <span>휴대전화</span>
                <input
                  type='text'
                  autoComplete='off'
                  placeholder='전화번호를 입력해주세요.'
                  onChange={phoneNumRegex}
                  value={inputValue}
                />
              </div>
              <div className='password'>
                <span>비밀번호</span>
                <input
                  type='password'
                  autoComplete='off'
                  placeholder='비밀번호를 입력해주세요.'
                  onChange={e =>
                    changeState(setMemberInfo, 'password', e.target.value)
                  }
                />
              </div>
            </div>
            <div className='email-line'>
              <div>
                <span>이메일</span>
                <input
                  type='text'
                  autoComplete='off'
                  placeholder='이메일을 입력해주세요.'
                  onChange={e =>
                    changeState(setMemberInfo, 'email', e.target.value)
                  }
                />
              </div>
            </div>
            <div className='address-line'>
              <span>주소</span>
              <input
                type='text'
                placeholder='주소 찾기 버튼을 클릭해주세요'
                autoComplete='off'
                disabled='disabled'
                value={addressDetail}
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
            <button className='commonBtn' onClick={createMember}>
              등록
            </button>
            <button
              className='commonBtn list'
              onClick={() => navigate('/personnel')}>
              목록
            </button>
          </div>
          {/* <div className='btn-wrap'>
            <button className='commonBtn'>수정</button>
            <button className='commonBtn delete'>삭제</button>
            <button className='commonBtn list'>목록</button>
          </div> */}
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'cancel' || alert === 'apply') navigate(`/personnel`);
            else if (alert === 'edit') navigate(`/personnel/${id}`);
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
            else return;
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
