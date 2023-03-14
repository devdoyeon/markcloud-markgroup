import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import CommonModal from 'common/CommonModal';
import { changeTitle, catchError } from 'js/commonUtils';
import { getMarkDetail } from 'js/groupwareApi';

const MarkDetail = () => {
  const [info, setInfo] = useState({});
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const path = useLocation().pathname;
  const { id } = useParams();
  let prevent = false;
  const navigate = useNavigate();

  const eng2Kor = txt => {
    switch (txt) {
      case 'patent':
        return '특허';
      case 'design':
        return '디자인';
      case 'mark':
        return '상표';
      case 'application':
        return '출원';
      case 'decide':
        return '심사중';
      case 'opinionNotice':
        return '의견제출통지';
      case 'apply':
        return '등록';
      default:
        return;
    }
  };

  const getDetail = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getMarkDetail(id);
    if (typeof result === 'object') {
      setInfo(result?.data);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 지식재산권 등록');
    getDetail();
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
                <input type='text' readOnly value={eng2Kor(info?.rights)} />
              </div>
              <div className='row inputBox'>
                <span>출원일</span>
                <input type='date' readOnly value={info?.application_date} />
              </div>
              <div className='row inputBox last'>
                <span>출원번호</span>
                <input type='text' readOnly value={info?.application_number} />
              </div>
            </div>
            <hr />
            <div className='row'>
              <div className='row inputBox first'>
                <span>출원인</span>
                <input type='text' readOnly value={info?.applicant} />
              </div>
              <div className='row inputBox last'>
                <span>상태</span>
                <input type='text' readOnly value={eng2Kor(info?.ip_status)} />
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
                    readOnly
                    value={info?.name_kor}
                  />
                </div>
                <div className='row lang'>
                  <span className='langSpan'>영문</span>
                  <input
                    type='text'
                    className='langInput'
                    readOnly
                    value={info?.name_eng}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className='row inputBox single'>
              <span>상품류</span>
              <input type='text' readOnly value={info?.product_code} />
            </div>
            <hr />
            <div className='row'>
              <div className='row inputBox first'>
                <span>등록일</span>
                <input type='date' readOnly value={info?.registration_date} />
              </div>
              <div className='row inputBox last'>
                <span>등록번호</span>
                <input type='text' readOnly value={info?.registration_number} />
              </div>
            </div>
            <hr />
            <div className='row'>
              <span className='row fileName'>파일명</span>
            </div>
            <hr />
            <div className='btnWrap row'>
              {path?.includes('add') ? (
                <button className='commonBtn applyBtn'>등록</button>
              ) : (
                <>
                  <button
                    className='commonBtn applyBtn'
                    onClick={() =>
                      navigate(`/mark-group/manage-mark/edit/${id}`)
                    }>
                    수정
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
            else return;
          }}
        />
      )}
    </>
  );
};

export default MarkDetail;
