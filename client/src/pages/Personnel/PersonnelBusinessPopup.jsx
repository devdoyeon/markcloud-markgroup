import { changeState } from 'js/commonUtils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  getDepartmentCreate,
  getDepartmentDelete,
  getDepartmentUpdate,
} from 'js/groupwareApi';

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
}) => {
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
      }
    }
  };

  const updatePersonnelDepartment = async () => {
    const curData = await getDepartmentUpdate(curDepartment);
    if (typeof curData === 'object') {
      getPersonDepartmentApi();
      changeState(setCurDepartment, 'section', '');
    }
  };

  const deletePersonnelDepartment = async () => {
    const del = await getDepartmentDelete(curDepartment?.id);
    if (typeof del === 'object') {
      const pageCon = { ...departmentPageInfo };
      pageCon.page = 1;
      getPersonDepartmentApi(pageCon);
      changeState(setCurDepartment, 'section', '');
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
