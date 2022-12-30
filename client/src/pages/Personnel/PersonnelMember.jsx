import { useEffect, useState, useRef } from 'react';
import SideMenu from 'common/SideMenu';
import { useNavigate, useParams } from 'react-router-dom';
import CommonSelect from 'common/CommonSelect';
import {
  getDepartmentList,
  getMemberCreate,
  getMemberInfo,
  getMemberUpdate,
  getMemberDelete,
} from 'js/groupwareApi';
import CommonModal from 'common/CommonModal';
import {
  catchError,
  changeState,
  changeTitle,
  commonModalSetting,
  regularExpression,
} from 'js/commonUtils';
import PostCode from './PostCode';
import { getCookie } from 'js/cookie';
import axios from 'axios';

const PersonnelMember = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
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
  const [departmentName, setDepartmentName] = useState([]);

  const [departmentList, setDepartmentList] = useState([]);
  const [departmentMeta, setDepartmentMeta] = useState({});

  const [contactValue, setContactValue] = useState('===');

  const [departmentPageInfo, setDepartmentPageInfo] = useState({
    page: 1,
    totalPage: 0,
    limit: 6,
  });
  const [inputValue, setInputValue] = useState('');

  //팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //주소 관련 state
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState(''); //상세주소

  // 아이디 중복체크 state
  const [idCheck, setIdCheck] = useState();

  const { id } = useParams();
  const navigate = useNavigate();

  const cookie = getCookie('myToken');
  const inputRef = useRef([]);

  let prevent = false;
  //~부서 리스트 API 요청
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
      for (let i = 0; i < data.length; i++) {
        setDepartmentName(name => [...name, data[i].section]);
      }
      setDepartmentPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    }
  };
  let prevent2 = false;
  //~ 사용자계정 정보 API 요청
  const getPersonMemberInfo = async () => {
    if (prevent2) return;
    prevent = true;
    setTimeout(() => {
      prevent2 = false;
    }, 200);
    const result = await getMemberInfo(id);
    if (typeof result === 'object') {
      setMemberInfo(result?.data);
      setContactValue(result?.data.section);
    }
  };
  const createMember = async () => {
    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    //~ 사용자계정 생성 유효성 검사
    if (inputRef.current[0].value === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '아이디를 입력하지 않았습니다.'
      );
    } else if (korean.test(inputRef.current[0].value)) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '아이디에 한글을 포함할 수 없습니다.'
      );
    } else if (idCheck === undefined || idCheck === 'undefined') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '아이디 중복체크를 하지 않았습니다.'
      );
    } else if (inputRef.current[1].value === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '성명을 입력하지 않았습니다.'
      );
    } else if (memberInfo.gender === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '성별을 선택하지 않았습니다.'
      );
    } else if (inputRef.current[2].value === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '생년월일을 선택하지 않았습니다.'
      );
    } else if (memberInfo.section === '===') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '소속을 선택하지 않았습니다.'
      );
    } else if (inputRef.current[3].value === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '휴대전화번호를 입력하지 않았습니다.'
      );
    } else if (inputRef.current[4].value === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '비밀번호를 입력하지 않았습니다.'
      );
    } else if (inputRef.current[5].value === '') {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '이메일을 입력하지 않았습니다.'
      );
    } else if (!(await regularExpression('email', inputRef.current[5].value))) {
      inputRef.current[5].focus();
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '이메일의 형식이 맞지 않습니다.'
      );
    }
    // - 사용자계정 생성
    const result = await getMemberCreate(memberInfo);
    if (typeof result === 'object') {
      setAlert('apply');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '등록이 완료되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  // -- 아이디 중복체크
  const duplicateId = async () => {
    if (!(await regularExpression('id', memberInfo.user_id))) {
      if (inputRef.current[0].value.length < 4) {
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '아이디의 길이는 4~30 입니다.'
        );
      } else {
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '아이디에 한글을 포함할 수 없습니다.'
        );
      }
    }
    const param = { user_id: memberInfo.user_id.trim() };
    const headers = {
      'Content-Type': 'application/json',
      'access-token': cookie,
    };
    try {
      const res = await axios.post(`/api/auth/check/id-duplicate`, param, {
        headers,
      });
      if (res.data.data) {
        setIdCheck(true);
        return;
      }
    } catch (error) {
      const { data, status } = error.response;
      if (status === 500) setAlert('error');
      else if (status === 501 || data.detail === 'PendingRollbackError') {
        duplicateId();
      } else if (
        data.detail === 'Duplicated ID' ||
        data.detail === 'Retired User'
      ) {
        setIdCheck(false);
        inputRef.current[0].focus();
      }
    }
  };
  //~~~~~~ 업데이트 ~~~~~~~
  const updateMemberApi = async () => {
    const result = await getMemberUpdate(memberInfo);
    if (typeof result === 'object') {
      setAlert('apply');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '수정이 완료되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };
  //~~~~~~~~~ 멤버 삭제 ~~~~~~~~~~
  const deleteMemberApi = async () => {
    const result = await getMemberDelete(id);
    if (typeof result === 'object') {
      setAlert('apply');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '삭제가 완료되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const phoneNumRegex = e => {
    const regex = /^[0-9\b -]{0,11}$/;
    if (regex.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 인사 관리');
      getPersonDepartmentApi();
      if (id) {
        getPersonMemberInfo();
        changeState(setMemberInfo, 'gender', memberInfo?.gender);
      }
    }
  }, []);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setMemberInfo, 'section', contactValue);
  }, [contactValue]);

  useEffect(() => {
    if (getCookie('myToken')) {
      changeState(setMemberInfo, 'phone', inputValue);
    }
  }, [inputValue]);

  // 주소 검색
  useEffect(() => {
    if (!isPopupOpen && getCookie('myToken')) {
      changeState(setMemberInfo, 'address', addressDetail);
      changeState(setMemberInfo, 'zip_code', address);
    }
  }, [isPopupOpen]);

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
                {id ? (
                  <input
                    type='text'
                    value={memberInfo.user_id}
                    autoComplete='off'
                    placeholder='아이디를 입력해주세요.'
                    disabled='disabled'
                    ref={el => (inputRef.current[0] = el)}
                  />
                ) : (
                  <input
                    type='text'
                    value={memberInfo.user_id}
                    autoComplete='off'
                    placeholder='아이디를 입력해주세요.'
                    ref={el => (inputRef.current[0] = el)}
                    onChange={e => {
                      changeState(setMemberInfo, 'user_id', e.target.value);
                      if (inputRef.current[0].value === '') {
                        setIdCheck();
                      }
                    }}
                  />
                )}
                {id ? (
                  <></>
                ) : (
                  <>
                    <button className='commonBtn' onClick={() => duplicateId()}>
                      중복체크
                    </button>
                    <span className={idCheck === false ? 'red' : 'blue'}>
                      {inputRef.current[0]?.value === ''
                        ? ''
                        : idCheck === undefined
                        ? ''
                        : idCheck === false
                        ? '중복된 아이디입니다.'
                        : '사용가능한 아이디입니다.'}
                    </span>
                  </>
                )}
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
                  ref={el => (inputRef.current[1] = el)}
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
                      value='male'
                      checked={memberInfo.gender === 'male'}
                      onChange={e =>
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
                      value='female'
                      checked={memberInfo.gender === 'female'}
                      onChange={e =>
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
                  value={memberInfo.birthday}
                  ref={el => (inputRef.current[2] = el)}
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
              <div className={id ? 'phone id' : 'phone'}>
                <span>휴대전화</span>
                {id ? (
                  <input
                    type='text'
                    autoComplete='off'
                    placeholder='전화번호를 입력해주세요.'
                    onChange={phoneNumRegex}
                    value={memberInfo.phone}
                  />
                ) : (
                  <input
                    type='text'
                    autoComplete='off'
                    placeholder='전화번호를 입력해주세요.'
                    ref={el => (inputRef.current[3] = el)}
                    onChange={phoneNumRegex}
                    value={inputValue}
                  />
                )}
              </div>
              {id ? (
                <></>
              ) : (
                <div className='password'>
                  <span>비밀번호</span>
                  <input
                    type='password'
                    autoComplete='off'
                    placeholder='비밀번호를 입력해주세요.'
                    ref={el => (inputRef.current[4] = el)}
                    value={memberInfo.password}
                    onChange={e =>
                      changeState(setMemberInfo, 'password', e.target.value)
                    }
                  />
                </div>
              )}
            </div>
            <div className='email-line'>
              <div>
                <span>이메일</span>
                <input
                  type='text'
                  autoComplete='off'
                  placeholder='이메일을 입력해주세요.'
                  ref={el => (inputRef.current[5] = el)}
                  value={memberInfo.email}
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
                value={memberInfo.address}
                ref={el => (inputRef.current[6] = el)}
                onChange={e => setAddressDetail(e.target.value)}
              />
              <button
                className='commonBtn'
                onClick={() => setIsPopupOpen(true)}>
                주소찾기
              </button>
            </div>
          </div>
          {id ? (
            <div className='btn-wrap'>
              <button
                className='commonBtn'
                onClick={() => {
                  updateMemberApi(memberInfo);
                }}>
                수정
              </button>
              <button
                className='commonBtn delete'
                onClick={() => deleteMemberApi()}>
                삭제
              </button>
              <button
                className='commonBtn list'
                onClick={() => navigate(`/personnel`)}>
                목록
              </button>
            </div>
          ) : (
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
          )}
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
