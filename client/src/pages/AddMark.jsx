import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonModal from 'common/CommonModal';
import CommonHeader from 'common/CommonHeader';
import CommonSelect from 'common/CommonSelect';
import {
  changeState,
  changeTitle,
  commonModalSetting,
  catchError,
} from 'js/commonUtils';
import {
  makeMarkData,
  getMarkDetail,
  editMark,
  deleteMark,
} from 'js/groupwareApi';
import fileUploadIcon from 'image/fileUploadIcon.svg';
import deleteIcon from 'image/deleteIcon.svg';

const AddMark = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [rightFilter, setRightFilter] = useState('선택');
  const [statusFilter, setStatusFilter] = useState('선택');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState('');
  const [markData, setMarkData] = useState({
    application_date: '',
    application_number: '',
    applicant: '',
    name_kor: '',
    name_eng: '',
    product_code: '',
    registration_date: '',
    registration_number: '',
  });
  const navigate = useNavigate();
  let prevent = false;
  const { id } = useParams();

  const path = useLocation().pathname;

  const rightArr = ['선택', '특허', '디자인', '상표'];
  const statusArr = ['선택', '출원', '심사중', '의견제출통지', '등록'];

  const applyOrEditMark = async () => {
    const arr = Object.values(markData);
    for (let value of arr) {
      if (
        value.trim() === '' ||
        rightFilter === 'none' ||
        statusFilter === 'none'
      ) {
        setAlert('emptyValue');
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '양식이 모두 입력되지 않았습니다.<br/>정확하게 입력해 주세요.'
        );
      }
    }
    const query = { ...markData };
    query.rights = rightFilter;
    query.status = statusFilter;
    let result;
    if (id?.length) result = editMark(id, query);
    else result = await makeMarkData(query);
    if (typeof result === 'object') {
      setAlert('successApply');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        `정상적으로 ${id.length ? '수정' : '등록'} 되었습니다.`
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const removeMark = async () => {
    const result = await deleteMark(id);
    if (typeof result === 'object') {
      setAlert('deleteSuccess');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        `정상적으로 삭제 되었습니다.`
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const getOrigin = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getMarkDetail(id);
    if (typeof result === 'object') {
      setMarkData(result?.data);
      setRightFilter(result?.data?.rights);
      setStatusFilter(result?.data?.status);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    let kor = rightFilter;
    switch (kor) {
      case '선택':
        setRightFilter('none');
        break;
      case '특허':
        setRightFilter('patent');
        break;
      case '디자인':
        setRightFilter('design');
        break;
      case '상표':
        setRightFilter('mark');
        break;
      default:
        return;
    }
  }, [rightFilter]);

  useEffect(() => {
    let kor = statusFilter;
    switch (kor) {
      case '선택':
        setStatusFilter('none');
        break;
      case '출원':
        setStatusFilter('application');
        break;
      case '심사중':
        setStatusFilter('decide');
        break;
      case '의견제출통지':
        setStatusFilter('opinionNotice');
        break;
      case '등록':
        setStatusFilter('apply');
        break;
      default:
        return;
    }
  }, [statusFilter]);

  const fileNameSettingFn = () => {
    if (file?.length)
      for (let { name } of file) {
        setFileName(name);
      }
    else setFileName('');
  };

  useEffect(() => {
    fileNameSettingFn();
  }, [file]);

  useEffect(() => {
    changeTitle('그룹웨어 > 지식재산권 등록');
    if (id?.length) getOrigin();
  }, []);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap addMark'>
          <CommonHeader />
          <div className='input-wrap column'>
            <hr />
            <div className='row'>
              <div className='row inputBox first'>
                <span>권리</span>
                <CommonSelect
                  opt={rightArr}
                  selectVal={rightFilter}
                  setSelectVal={setRightFilter}
                />
              </div>
              <div className='row inputBox'>
                <span>출원일</span>
                <input
                  type='date'
                  onChange={e =>
                    changeState(setMarkData, 'application_date', e.target.value)
                  }
                  value={markData?.application_date}
                />
              </div>
              <div className='row inputBox last'>
                <span>출원번호</span>
                <input
                  type='text'
                  onChange={e =>
                    changeState(
                      setMarkData,
                      'application_number',
                      e.target.value
                    )
                  }
                  value={markData?.application_number}
                />
              </div>
            </div>
            <hr />
            <div className='row'>
              <div className='row inputBox first'>
                <span>출원인</span>
                <input
                  type='text'
                  placeholder='성명을 입력해 주세요.'
                  onChange={e =>
                    changeState(setMarkData, 'applicant', e.target.value)
                  }
                  value={markData?.applicant}
                />
              </div>
              <div className='row inputBox last'>
                <span>상태</span>
                <CommonSelect
                  opt={statusArr}
                  selectVal={statusFilter}
                  setSelectVal={setStatusFilter}
                />
              </div>
            </div>
            <hr />
            <div className='row'>
              <span>명칭</span>
              <div className='column'>
                <div className='row lang'>
                  <span className='langSpan'>국문</span>
                  <input
                    type='text'
                    className='langInput'
                    onChange={e =>
                      changeState(setMarkData, 'name_kor', e.target.value)
                    }
                    value={markData?.name_kor}
                  />
                </div>
                <div className='row lang'>
                  <span className='langSpan'>영문</span>
                  <input
                    type='text'
                    className='langInput'
                    onChange={e =>
                      changeState(setMarkData, 'name_eng', e.target.value)
                    }
                    value={markData?.name_eng}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className='row inputBox single'>
              <span>상품류</span>
              <input
                type='text'
                onChange={e =>
                  changeState(setMarkData, 'product_code', e.target.value)
                }
                value={markData?.product_code}
              />
            </div>
            <hr />
            <div className='row'>
              <div className='row inputBox first'>
                <span>등록일</span>
                <input
                  type='date'
                  onChange={e =>
                    changeState(
                      setMarkData,
                      'registration_date',
                      e.target.value
                    )
                  }
                  value={markData?.registration_date}
                />
              </div>
              <div className='row inputBox last'>
                <span>등록번호</span>
                <input
                  type='text'
                  onChange={e =>
                    changeState(
                      setMarkData,
                      'registration_number',
                      e.target.value
                    )
                  }
                  value={markData?.registration_number}
                />
              </div>
            </div>
            <hr />
            <div className='row'>
              <span>파일첨부</span>
              <label htmlFor='fileInput'>
                <span className='fileUpload row'>
                  파일선택
                  <img src={fileUploadIcon} alt='파일 업로드 아이콘' />
                </span>
              </label>
              <input
                type='file'
                id='fileInput'
                onChange={e => setFile(e.target.files)}
              />
              {fileName ? (
                <span className='row fileName'>
                  {fileName}
                  <img
                    src={deleteIcon}
                    alt='삭제 아이콘'
                    onClick={() => setFile('')}
                  />
                </span>
              ) : (
                <></>
              )}
            </div>
            <hr />
            <div className='btnWrap row'>
              {path?.includes('add') ? (
                <button
                  className='commonBtn applyBtn'
                  onClick={applyOrEditMark}>
                  등록
                </button>
              ) : (
                <>
                  <button
                    className='commonBtn applyBtn'
                    onClick={applyOrEditMark}>
                    수정
                  </button>
                  <button
                    className='commonBtn deleteBtn'
                    onClick={() => {
                      setAlert('confirmDelete');
                      commonModalSetting(
                        setAlertBox,
                        true,
                        'confirm',
                        `삭제된 지식재산은 복구할 수 없습니다.<br/>정말 삭제하시겠습니까?`
                      );
                    }}>
                    삭제
                  </button>
                  <button
                    className='commonBtn listBtn'
                    onClick={() => navigate('/mark-group/manage-mark/')}>
                    목록
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'duplicateLogin')
              return navigate('/mark-group/sign-in');
            else if (alert === 'tokenExpired') navigate('/mark-group/');
            else if (alert === 'successApply' || alert === 'deleteSuccess')
              navigate('/mark-group/manage-mark/');
            else if (alert === 'confirmDelete') removeMark();
            else return;
          }}
        />
      )}
    </>
  );
};

export default AddMark;
