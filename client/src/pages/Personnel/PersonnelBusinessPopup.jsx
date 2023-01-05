import { useState } from 'react';
import { changeState } from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import {
  getDepartmentCreate,
  getDepartmentDelete,
  getDepartmentUpdate,
} from 'js/groupwareApi';
import { commonModalSetting } from 'js/commonUtils';

const PersonnelBusinessPopup = ({
  popup,
  setPopup,
  buttonControl,
  setButtonControl,
  curDepartment,
  setCurDepartment,
  getPersonDepartmentApi,
  departmentList,
  departmentPageInfo,
  getPersonMemberApi,
}) => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const projectName = [];
  if (departmentList.length > 0) {
    departmentList?.forEach(ele => {
      projectName.push(ele.section);
    });
  }

  const createPersonnelDepartment = async () => {
    if (curDepartment?.section.trim() !== '') {
      const create = await getDepartmentCreate(curDepartment?.section);
      if (typeof create === 'object') {
        changeState(setCurDepartment, 'section', '');
        getPersonDepartmentApi();
        setAlert('create');
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '등록이 완료되었습니다.'
        );
      }
    }
  };

  const updatePersonnelDepartment = async () => {
    const curData = await getDepartmentUpdate(curDepartment);
    if (typeof curData === 'object') {
      getPersonDepartmentApi();
      getPersonMemberApi();
      changeState(setCurDepartment, 'section', '');
      setAlert('edit');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '수정이 완료되었습니다.'
      );
    }
  };

  const deletePersonnelDepartment = async () => {
    const del = await getDepartmentDelete(curDepartment?.id);
    if (typeof del === 'object') {
      const pageCon = { ...departmentPageInfo };
      pageCon.page = 1;
      getPersonDepartmentApi(pageCon);
      changeState(setCurDepartment, 'section', '');
      setAlert('delete');
      return commonModalSetting(setAlertBox, true, 'alert', '삭제되었습니다.');
    }
  };

  const closePersonnelDepartment = () => {
    changeState(setCurDepartment, 'section', '');
  };

  return (
    <div className='popup-bg'>
      <div className='popup'>
        {buttonControl === '등록' ? (
          <div className='head'>새 부서 등록</div>
        ) : (
          <div className='head'>부서 수정</div>
        )}
        <div className='content-wrap'>
          <div className='content'>
            <label>
              <span>부서명</span>
              <input
                type='text'
                placeholder='부서명을 입력해주세요.'
                maxLength='20'
                value={curDepartment?.section ? curDepartment?.section : ''}
                onChange={e =>
                  changeState(setCurDepartment, 'section', e.target.value)
                }
              />
            </label>
          </div>
          {buttonControl === '등록' ? (
            <div className='btn-wrap'>
              <button
                className='commonBtn'
                onClick={() => {
                  setButtonControl('');
                  setAlert('createConfirm');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    '부서를 등록 하시겠습니까?'
                  );
                }}>
                등록
              </button>
              <button
                className='commonBtn close'
                onClick={() => {
                  setPopup(false);
                  setButtonControl('');
                  closePersonnelDepartment();
                }}>
                닫기
              </button>
            </div>
          ) : (
            <div className='btn-wrap'>
              <button
                className='commonBtn'
                onClick={() => {
                  // setPopup(false);
                  setButtonControl('');
                  setAlert('updateConfirm');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    '부서명을 수정하시겠습니까?'
                  );
                }}>
                수정
              </button>
              <button
                className='commonBtn delete'
                onClick={() => {
                  setButtonControl('');
                  setAlert('deleteConfirm');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    '부서를 삭제하시겠습니까?'
                  );
                }}>
                삭제
              </button>
              <button
                className='commonBtn close'
                onClick={() => {
                  setPopup(false);
                  setButtonControl('');
                  closePersonnelDepartment();
                }}>
                닫기
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
            if (
              alert === 'cancel' ||
              alert === 'apply' ||
              alert === 'delete' ||
              alert === 'edit' ||
              alert === 'create'
            ) {
              setPopup(false);
            } else if (alert === 'createConfirm') {
              createPersonnelDepartment();
            } else if (alert === 'updateConfirm') {
              updatePersonnelDepartment();
            } else if (alert === 'deleteConfirm') {
              deletePersonnelDepartment();
            } else return;
          }}
        />
      )}
    </div>
  );
};

export default PersonnelBusinessPopup;
