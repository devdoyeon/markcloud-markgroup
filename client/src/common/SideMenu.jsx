import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCookie, removeCookie } from 'js/cookie';
import { commonModalSetting } from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import rightArrow from 'image/rightArrow.svg';
import goHomeIcon from 'image/goHomeIcon.svg';
import mainLogo from 'image/groupware-logo.png';
import { checkPoint } from 'js/groupwareApi';

const SideMenu = () => {
  const [render, setRender] = useState('active');
  const [authority, setAuthrotiy] = useState('user');
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });

  const checkUser = async () => {
    const result = await checkPoint();
    console.log(result);
    if (typeof result === 'object') {
      setRender('active');
      if (result?.data?.status?.code === 201) setAuthrotiy('admin');
      else if (result?.data?.status?.code === 301) setAuthrotiy('user');
    } else if (result === 'paymentRequired') {
      setAlert(result);
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '유료 결제가 필요한 서비스입니다.'
      );
      setRender('block');
      return;
    } else if (result === 'serviceExpired') {
      setAlert(result);
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '서비스 사용 기간이 만료되었습니다.'
      );
      setRender('block');
    }
  };

  useEffect(() => {
    if (!getCookie('myToken')) {
      setAlert('needLogin');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '로그인이 필요한 서비스입니다.'
      );
      setRender('block');

      return;
    } else checkUser();
  }, []);

  const path = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <>
      {render === 'active' ? (
        <div className='sidebar'>
          <img
            src={mainLogo}
            alt='마크그룹 로고'
            onClick={() => navigate('/business')}
          />
          <ul>
            <li
              className={path.includes('/business') ? 'active' : ''}
              onClick={() => navigate('/business')}>
              업무 관리
            </li>
            <li
              className={path.includes('/project') ? 'active' : ''}
              onClick={() => navigate('/project')}>
              프로젝트 현황
            </li>
            <li
              className={path.includes('/report') ? 'active' : ''}
              onClick={() => navigate('/report')}>
              주간 업무 보고
            </li>
            <li
              className={path.includes('/notice') ? 'active' : ''}
              onClick={() => navigate('/notice')}>
              공지사항
            </li>
            <li
              className={path.includes('/board') ? 'active' : ''}
              onClick={() => navigate('/board')}>
              게시판
            </li>
            {authority === 'admin' ? (
              <>
                <li
                  className={path.includes('/personnel') ? 'active' : ''}
                  onClick={() => navigate('/personnel')}>
                  인사 관리
                </li>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-view'
                    target='_blank'
                    rel='noopener noreferrer'>
                    MarkView
                  </a>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
          <div className='column tools'>
            <div className='go-home' onClick={() => navigate('/')}>
              <img src={goHomeIcon} alt='홈으로 가기 아이콘' />
            </div>
            <div
              className='logoutBtn'
              onClick={() => {
                removeCookie('myToken');
                navigate('/');
                localStorage.clear();
              }}>
              로그아웃
            </div>
            <div className='row'>
              <span>
                {localStorage.getItem('userName')}(
                {localStorage.getItem('userId')})
              </span>
              <img src={rightArrow} alt='더보기 아이콘' />
            </div>
          </div>
        </div>
      ) : (
        <div className='blockContent'></div>
      )}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'needLogin') return navigate('/sign-in');
            else if (alert === 'paymentRequired') return navigate('/cost');
            else if (alert === 'serviceExpired') return navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default SideMenu;
