import $ from 'jquery';
import { removeCookie } from './cookie';

// ================================== 도연 ==================================

export const errorList = {
  emptyBoth: '아이디와 비밀번호를 입력해 주세요.',
  emptyId: '아이디를 입력해 주세요.',
  emptyPw: '비밀번호를 입력해 주세요.',
  wrongInfo:
    '아이디 또는 비밀번호가 일치하지 않습니다.<br/>다시 입력해 주세요.',
  serverError: '잠시 후 다시 시도해 주세요.',
  accessDenied: '접근 권한이 없습니다.',
  NotAuthority: '권한이 없습니다.',
  duplicateLogin: '중복 로그인 되었습니다.<br/>다시 로그인해 주세요.',
  tokenExpired: '토큰이 만료되었습니다.<br/>다시 로그인해 주세요.',
  loginExceeded:
    '로그인 횟수가 초과되었습니다.<br/>잠시 후 다시 시도해 주세요.',
  paymentRequired:
    '유료 결제가 필요한 서비스입니다.<br/>요금제 안내 페이지로 이동하시겠습니까?',
  serviceExpired: '서비스 사용 기간이 만료되었습니다.',
};

export const catchError = async (result, navigate, setAlertBox, setAlert) => {
  if (
    result === 'serverError' ||
    result === 'accessDenied' ||
    result === 'NotAuthority' ||
    result === 'tokenExpired' ||
    result === 'loginExceeded' ||
    result === 'serviceExpired'
  ) {
    setAlert(result);
    return commonModalSetting(setAlertBox, true, 'alert', errorList[result]);
  } else if (result === 'duplicateLogin') {
    setAlert(result);
    removeCookie('myToken');
    return commonModalSetting(setAlertBox, true, 'alert', errorList[result]);
  } else if (result === 'paymentRequired') {
    setAlert(result);
    return commonModalSetting(setAlertBox, true, 'confirm', errorList[result]);
  } else if (result === 'notFound') return navigate('/not-found');
};

export const emptyCheck = value => {
  if (!value?.length || value?.trim() === '') return false;
  else return true;
};

export const changeState = (setState, col, val) => {
  setState(prev => {
    const clone = { ...prev };
    clone[col] = val;
    return clone;
  });
};

export const enterFn = (e, okFn) => {
  if (e.key === 'Enter') okFn();
};

export const commonModalSetting = (setAlertBox, bool, mode, content) => {
  if (bool) {
    setAlertBox({
      mode: mode,
      content: content,
      bool: bool,
    });
  } else {
    setAlertBox({
      mode: '',
      content: '',
      bool: bool,
    });
  }
};

export const changeTitle = txt => {
  document.title = txt;
};

export const headerHoverEvent = () => {
  const main = '.main-nav';
  const sub = '.sub-nav';
  const bg = '.sub-nav-bg';
  const speed = 300;
  $(main).mouseenter(function () {
    $('.common-header').css({
      backgroundColor: 'rgba(21, 23, 26, 0.5)',
      borderBottom: '1px solid #FFFFFF',
    });
    $(sub + ',' + bg)
      .stop()
      .slideUp(0);
    $(this).next().stop().slideDown(speed);
    $(bg).stop().slideDown(speed);
    $(this)
      .parent()
      .mouseleave(function () {
        $(this).find(sub).stop().slideUp(speed);
        $(bg).stop().slideUp(speed);
        $('.common-header').css({
          backgroundColor: 'transparent',
          borderBottom: 'none',
        });
      });
  });
};

export const addComma = str => {
  if (!str) return '';
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getKeyByValue = (obj, value) => {
  return Object.keys(obj).find(key => obj[key] === value);
};

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const addHypen = str => {
  if (!str) return '';
  return str.substr(0, 3) + '-' + str.substr(3, 4) + '-' + str.substr(7);
};

export const regularExpression = async (type, str) => {
  let regExp;
  switch (type) {
    case 'id':
      regExp = /^[a-z0-9]{4,30}$/;
      break;
    case 'pw':
      regExp =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
      break;
    case 'email':
      regExp =
        /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(kr|aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
      break;
    default:
      break;
  }
  return regExp.test(str.trim());
};
