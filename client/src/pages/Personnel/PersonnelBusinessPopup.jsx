import { changeState } from 'js/commonUtils';
import { useEffect, useState } from 'react';
import { getDepartmentUpdate } from 'js/groupwareApi';

const PersonnelBusinessPopup = ({
  popup,
  setPopup,
  buttonControl,
  setButtonControl,
  curDepartment,
  setCurDepartment,
}) => {
  const updatePersonnelDepartment = async () => {
    const update = await getDepartmentUpdate(curDepartment);
  };
  useEffect(() => {}, [popup]);

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
                value={curDepartment?.department_name}
                onChange={e =>
                  changeState(
                    setCurDepartment,
                    'department_name',
                    e.target.value
                  )
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
                }}>
                등록
              </button>
              <button
                className='commonBtn close'
                onClick={() => {
                  setPopup(false);
                  setButtonControl('');
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
                }}>
                삭제
              </button>
              <button
                className='commonBtn close'
                onClick={() => {
                  setPopup(false);
                  setButtonControl('');
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
