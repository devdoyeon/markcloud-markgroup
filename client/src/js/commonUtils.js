import { removeCookie } from './cookie';

// ================================== DY ==================================

//& 에러 리스트
export const errorList = {
  retiredUser: '탈퇴한 유저입니다.<br/>다시 회원가입해 주세요.',
  emptyBoth: '아이디와 비밀번호를 입력해 주세요.',
  emptyId: '아이디를 입력해 주세요.',
  emptyPw: '비밀번호를 입력해 주세요.',
  PaymentPending: '결제 혹은 결제 대기 중인 이용권이 있습니다.',
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
  alreadyProjectName: '이미 존재하는 프로젝트 이름입니다.',
  alreadyUsedProject:
    '업무 관리에 등록되어 있는 프로젝트입니다.<br/>프로젝트를 삭제할 수 없습니다.',
};

//& API 통신 결과 에러 반환일 때 ErrorHandling Fn
export const catchError = async (result, navigate, setAlertBox, setAlert) => {
  if (
    result === 'serverError' ||
    result === 'accessDenied' ||
    result === 'NotAuthority' ||
    result === 'loginExceeded' ||
    result === 'serviceExpired' ||
    result === 'alreadyProjectName' ||
    result === 'alreadyUsedProject'
  ) {
    setAlert(result);
    return commonModalSetting(setAlertBox, true, 'alert', errorList[result]);
  } else if (result === 'duplicateLogin') {
    setAlert(result);
    return commonModalSetting(setAlertBox, true, 'alert', errorList[result]);
  } else if (result === 'paymentRequired') {
    setAlert(result);
    return commonModalSetting(setAlertBox, true, 'confirm', errorList[result]);
  } else if (result === 'notFound')
    return navigate('/mark-groupware/not-found');
  else if (result === 'DuplicatedDpError')
    return commonModalSetting(setAlertBox, true, 'alert', errorList[result]);
  else if (result === 'tokenExpired') {
    setAlert(result);
    removeCookie('myToken', {
      path: '/',
      domain: 'markcloud.co.kr',
    });
    removeCookie('rfToken', {
      path: '/',
      domain: 'markcloud.co.kr',
    });
    localStorage.removeItem('yn');
    return commonModalSetting(setAlertBox, true, 'alert', errorList[result]);
  }
};

//& Input이나 기타 str값 emptyCheck
export const emptyCheck = value => {
  if (!value?.length || value?.trim() === '') return false;
  else return true;
};

//& Object 형식의 State 변경 용이하게 하는 함수
export const changeState = (setState, col, val) => {
  setState(prev => {
    const clone = { ...prev };
    clone[col] = val;
    return clone;
  });
};

//& 엔터 입력했을 때 사용하는 함수
export const enterFn = (e, okFn) => {
  if (e.key === 'Enter') okFn();
};

//& alert, confirm창 Handling
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

//& Document Title 변경 함수
export const changeTitle = txt => {
  document.title = txt;
};

//& 천 원 단위로 콤마 찍어주는 함수
export const addComma = str => {
  if (!str) return '';
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

//& 10보다 작을 경우 0 포함
export const addZero = t => {
  if (t < 10) return `0${t}`;
  else return t;
};

//& Object Value로 Key 뽑아와 주는 함수
export const getKeyByValue = (obj, value) => {
  return Object.keys(obj).find(key => obj[key] === value);
};

//& string을 html Type으로 변경해 주는 함수
export const text2html = (c, str) => {
  document.querySelector(c).innerHTML = new DOMParser().parseFromString(
    str,
    'text/html'
  ).body.innerHTML;
};

// ================================== BW ==================================

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
