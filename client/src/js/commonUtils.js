// ================================== 도연 ==================================

const errorList = {
  serverError: '잠시 후 다시 시도해 주세요.',
  accessDenied: '접근 권한이 없습니다.',
  NotAuthority: '권한이 없습니다.',
  duplicateLogin: '중복 로그인 되었습니다.<br/>다시 로그인해 주세요.',
  tokenExpired: '토큰이 만료되었습니다.<br/>다시 로그인해 주세요.',
};

export const catchError = async (result, navigate, setModal, setAlert) => {
  if (
    result === 'serverError' ||
    result === 'accessDenied' ||
    result === 'NotAuthority' ||
    result === 'duplicateLogin' ||
    result === 'tokenExpired'
  ) {
    setAlert(result);
    return commonModalSetting(setModal, true, 'alert', errorList[result]);
  } else if (result === 'notFound') return navigate('/error');
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

export const commonModalSetting = (setAlertBox, bool, mode, context) => {
  if (bool) {
    setAlertBox({
      mode: mode,
      context: context,
      bool: bool,
    });
  } else {
    setAlertBox({
      mode: '',
      context: '',
      bool: bool,
    });
  }
};

export const changeTitle = txt => {
  document.title = txt;
};

//================================== 병욱님 ==================================

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
