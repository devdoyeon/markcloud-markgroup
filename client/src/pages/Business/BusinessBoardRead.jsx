import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import { catchError, changeTitle, text2html, str2img } from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import { getBusinessInfo } from 'js/groupwareApi';
import { getCookie } from 'js/cookie';

const BusinessBoardRead = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [info, setInfo] = useState({});

  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  const getBusinessDetail = async () => {
    const pathName = path.split(`/`)[2];
    if (pathName !== 'business') return;
    const result = await getBusinessInfo(id);
    if (typeof result === 'object') {
      setInfo(result?.data);
      const str = str2img(result?.data?.img_url, result?.data?.content);
      text2html('.edit', str);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };
  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 상세 보기');
      if (id?.length) getBusinessDetail();
    }
  }, []);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap business'>
          <div className='header'>
            <h3>업무 관리</h3>
          </div>

          <div className='work-wrap project-work-wrap'>
            <div className='project-wrap project-name'>
              <div className='project-list'>
                <span className='pro'>프로젝트</span>
                <div className='pr-name'>{info?.project_name}</div>
              </div>
            </div>
            <div className='project-wrap board-head'>
              {/* ============================= */}
              <div className='project-list'>
                <span>요청자</span>
                <div>{info?.request_id}</div>
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>담당자</span>
                <div>{info?.manager_id}</div>
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>진행상태</span>
                <div>{info?.work_status}</div>
              </div>
            </div>
            <div className='project-wrap title'>
              <span>제목</span>
              <div className='title-input-wrap'>
                <div className='input-read'>{info?.title}</div>
              </div>
            </div>
            <div className='edit'></div>
          </div>
          <div className='btn-wrap'>
            <button
              className='commonBtn applyBtn'
              onClick={() => {
                navigate(`/mark-groupware/business/write/${id}`);
              }}>
              수정
            </button>
            <button
              className='commonBtn list'
              onClick={() => {
                navigate('/mark-groupware/business');
              }}>
              목록
            </button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'cancel' || alert === 'apply')
              navigate(`/mark-groupware/${path.split('/')[2]}`);
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/mark-groupware/sign-in');
            else if (alert === 'edit')
              navigate(`/mark-groupware/${path.split('/')[2]}/${id}`);
            else return;
          }}
        />
      )}
    </>
  );
};

export default BusinessBoardRead;
