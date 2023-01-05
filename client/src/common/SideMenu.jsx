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
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const checkUser = async () => {
    const result = await checkPoint();
    if (typeof result === 'object') {
      if (result?.data?.data === 'none') {
        setAlert('needDepartmentName');
        commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '회사명 입력이 필요합니다.<br/>회원 정보 변경 페이지로 이동하시겠습니까?'
        );
        return;
      }
      localStorage.setItem('department', result?.data?.data);
      setRender('active');
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
    } else if (
      path.includes('/personnel') &&
      localStorage.getItem('yn') === 'y'
    ) {
      setAlert('notAuthority');
      commonModalSetting(setAlertBox, true, 'alert', '접근 권한이 없습니다.');
      setRender('block');
    } else checkUser();
  }, []);

  return (
    <>
      {render === 'active' ? (
        <div className='sidebar'>
          <img
            src={mainLogo}
            alt='마크그룹 로고'
            onClick={() => navigate('/gp/business')}
          />
          <ul>
            <li
              className='departmentName'
              onClick={() => navigate('/gp/business')}>
              {localStorage.getItem('department')}
            </li>
            <li
              className={path.includes('/business') ? 'active' : ''}
              onClick={() => navigate('/gp/business')}>
              업무 관리
            </li>
            <li
              className={path.includes('/project') ? 'active' : ''}
              onClick={() => navigate('/gp/project')}>
              프로젝트 현황
            </li>
            <li
              className={path.includes('/report') ? 'active' : ''}
              onClick={() => navigate('/gp/report')}>
              주간 업무 보고
            </li>
            <li
              className={path.includes('/notice') ? 'active' : ''}
              onClick={() => navigate('/gp/notice')}>
              공지사항
            </li>
            <li
              className={path.includes('/board') ? 'active' : ''}
              onClick={() => navigate('/gp/board')}>
              게시판
            </li>
            {localStorage.getItem('yn') === 'n' ? (
              <>
                <li
                  className={path.includes('/personnel') ? 'active' : ''}
                  onClick={() => navigate('/gp/personnel')}>
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
            <div className='go-home' onClick={() => navigate('/gp/')}>
              <img src={goHomeIcon} alt='홈으로 가기 아이콘' />
            </div>
            <div
              className='logoutBtn'
              onClick={() => {
                removeCookie('myToken', { path: '/' });
                removeCookie('rfToken', { path: '/' });
                localStorage.clear();
                navigate('/gp/');
              }}>
              로그아웃
            </div>
            <a
              className='row go-myPage'
              href='https://markcloud.co.kr/mark-mypage'>
              <span>
                {localStorage.getItem('userName')}(
                {localStorage.getItem('userId')})
              </span>
              <img src={rightArrow} alt='더보기 아이콘' />
            </a>
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
            if (alert === 'needLogin') return navigate('/gp/sign-in');
            else if (alert === 'paymentRequired') return navigate('/gp/cost');
            else if (alert === 'serviceExpired') return navigate('/gp/');
            else if (alert === 'needDepartmentName')
              return (window.location.href =
                'https://markcloud.co.kr/mark-mypage');
            else if (alert === 'notAuthority') return navigate('/gp/business');
            else return;
          }}
        />
      )}
    </>
  );
};

export default SideMenu;
