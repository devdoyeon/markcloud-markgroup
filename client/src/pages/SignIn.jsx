import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonModal from 'common/CommonModal';
import CommonFooter from 'common/CommonFooter';
import CommonSiteMap from 'common/CommonSiteMap';
import { signIn } from 'js/groupwareApi';
import { setCookie, getCookie } from 'js/cookie';
import {
  catchError,
  changeState,
  enterFn,
  changeTitle,
  commonModalSetting,
  errorList,
} from 'js/commonUtils';

const SignIn = () => {
  const [alert, setAlert] = useState('');
  const obj = {
    emptyBoth: false,
    emptyId: false,
    emptyPw: false,
    wrongId: false,
    wrongPw: false,
  };
  const [userInfo, setUserInfo] = useState({
    id: '',
    pw: '',
  });
  const [capsLock, setCapsLock] = useState(false);
  const [formCheck, setFormCheck] = useState(obj);
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const navigate = useNavigate();

  //~ 아이디 | 비밀번호 확인해서 틀리거나 빈 부분 알려주는 함수
  const checkForm = async (checkStr, bool) => {
    const obj = {
      emptyBoth: false,
      emptyId: false,
      emptyPw: false,
      wrongId: false,
      wrongPw: false,
    };
    obj[checkStr] = bool;
    setFormCheck(obj);
  };

  const login = async () => {
    //@ 아이디, 비밀번호 Input이 비어 있는지 확인
    if (userInfo.id.trim() === '' && userInfo.pw.trim() === '')
      return checkForm('emptyBoth', true);
    else if (userInfo.id.trim() === '') return checkForm('emptyId', true);
    else if (userInfo.pw.trim() === '') return checkForm('emptyPw', true);

    const result = await signIn(userInfo.id, userInfo.pw);
    if (typeof result === 'object') {
      const { access_token, refresh_token } = result?.data?.data;
      setCookie('myToken', access_token, {
        path: '/',
        secure: false,
      });
      setCookie('rfToken', refresh_token, {
        path: '/',
        secure: false,
      });
      navigate('/');
    } else {
      //@ Error Handling
      if (result === 'wrongId' || result === 'wrongPw') checkForm(result, true);
      else return catchError(result, navigate, setAlertBox, setAlert);
    }
  };

  useEffect(() => {
    if (getCookie('myToken')) navigate('/');
    changeTitle('그룹웨어 > 로그인');
  }, []);

  useEffect(() => {
    if (formCheck.emptyBoth)
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        errorList.emptyBoth
      );
    else if (formCheck.emptyId)
      return commonModalSetting(setAlertBox, true, 'alert', errorList.emptyId);
    else if (formCheck.emptyPw)
      return commonModalSetting(setAlertBox, true, 'alert', errorList.emptyPw);
    else if (formCheck.wrongId || formCheck.wrongPw)
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        errorList.wrongInfo
      );
  }, [formCheck]);

  return (
    <div className='container'>
      <div className='signIn'>
        <CommonSiteMap color='black' />
        <div className='loginForm'>
          <h3>로그인</h3>
          <div className='line'></div>
          <input
            type='text'
            placeholder='아이디'
            value={userInfo.id}
            onChange={e => changeState(setUserInfo, 'id', e.target.value)}
            onKeyDown={e => {
              if (!alertBox.bool) enterFn(e, login);
              setCapsLock(e.getModifierState('CapsLock'));
            }}
          />
          <input
            type='password'
            placeholder='패스워드'
            value={userInfo.pw}
            onChange={e => changeState(setUserInfo, 'pw', e.target.value)}
            onKeyDown={e => {
              if (!alertBox.bool) enterFn(e, login);
              setCapsLock(e.getModifierState('CapsLock'));
            }}
          />
          <button onClick={login}>로그인</button>
          {capsLock && (
            <p>
              <span>CapsLock</span>이 켜져 있습니다.
            </p>
          )}
          <div className='row'>
            <a href='https://markcloud.co.kr/sign-up'>회원가입</a>
            <a href='https://markcloud.co.kr/find-id'>아이디 찾기</a>
            <a href='https://markcloud.co.kr/find-pw'>비밀번호 찾기</a>
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
        />
      )}
      <CommonFooter />
    </div>
  );
};

export default SignIn;
