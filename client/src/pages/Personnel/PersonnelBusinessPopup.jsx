import { changeState } from 'js/commonUtils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getDepartmentCreate,
  getDepartmentDelete,
  getDepartmentUpdate,
} from 'js/groupwareApi';
import { commonModalSetting, catchError, changeTitle } from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import { getCookie } from 'js/cookie';

const PersonnelBusinessPopup = ({
  popup,
  setPopup,
  buttonControl,
  setButtonControl,
  curDepartment,
  setCurDepartment,
}) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const cookie = getCookie('myToken');

  const createPersonnelDepartment = async () => {
    const create = await getDepartmentCreate(curDepartment?.section);
    changeState(setCurDepartment, 'section', '');
  };

  const updatePersonnelDepartment = async () => {
    const curData = await getDepartmentUpdate(curDepartment);
  };

  const deletePersonnelDepartment = async () => {
    const del = await getDepartmentDelete(curDepartment?.id);
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
                value={curDepartment?.section}
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
                  setPopup(false);
                  setButtonControl('');
                  createPersonnelDepartment();
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
                  setPopup(false);
                  setButtonControl('');
                  updatePersonnelDepartment();
                }}>
                수정
              </button>
              <button
                className='commonBtn delete'
                onClick={() => {
                  setPopup(false);
                  setButtonControl('');
                  deletePersonnelDepartment();
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
    </div>
  );
};

export default PersonnelBusinessPopup;
