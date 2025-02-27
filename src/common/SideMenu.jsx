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
        setRender('block');
        setAlert('needDepartmentName');
        commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '회사명 입력이 필요합니다.<br/>회원 정보 변경 페이지로 이동합니다.'
        );
        return;
      } else if (result?.data?.status?.code === 303) {
        setRender('block');
        setAlert('needPayment');
        commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '유료 결제가 필요한 서비스입니다.'
        );
        return;
      }
      localStorage.setItem('department', result?.data?.data);
      setRender('active');
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
            onClick={() => navigate('/mark-group/business')}
          />
          <ul>
            <li
              className='departmentName'
              onClick={() => navigate('/mark-group/business')}>
              {localStorage.getItem('department')}
            </li>
            <li
              className={path.includes('/business') ? 'active' : ''}
              onClick={() => navigate('/mark-group/business')}>
              업무 관리
            </li>
            <li
              className={path.includes('/project') ? 'active' : ''}
              onClick={() => navigate('/mark-group/project')}>
              프로젝트 현황
            </li>
            <li
              className={path.includes('/report') ? 'active' : ''}
              onClick={() => navigate('/mark-group/report')}>
              주간 업무 보고
            </li>
            <li
              className={path.includes('/notice') ? 'active' : ''}
              onClick={() => navigate('/mark-group/notice')}>
              공지사항
            </li>
            <li
              className={path.includes('/board') ? 'active' : ''}
              onClick={() => navigate('/mark-group/board')}>
              게시판
            </li>
            {localStorage.getItem('yn') === 'n' ? (
              <li
                className={path.includes('/personnel') ? 'active' : ''}
                onClick={() => navigate('/mark-group/personnel')}>
                인사 관리
              </li>
            ) : (
              <></>
            )}
            <li
              className={path.includes('/manage-mark') ? 'active' : ''}
              onClick={() => navigate('/mark-group/manage-mark')}>
              지식재산 관리
            </li>
            {localStorage.getItem('yn') === 'n' ? (
              <li>
                <a
                  href='https://markcloud.co.kr/mark-view'
                  target='_blank'
                  rel='noopener noreferrer'>
                  MarkView
                </a>
              </li>
            ) : (
              <></>
            )}
          </ul>
          <div className='column tools'>
            <div className='go-home' onClick={() => navigate('/mark-group/')}>
              <img src={goHomeIcon} alt='홈으로 가기 아이콘' />
            </div>
            <div
              className='logoutBtn'
              onClick={() => {
                localStorage.clear();
                removeCookie('myToken', {
                  path: '/',
                });
                removeCookie('rfToken', {
                  path: '/',
                });
                navigate('/mark-group/');
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
            if (alert === 'needLogin') return navigate('/mark-group/sign-in');
            else if (alert === 'serviceExpired')
              return navigate('/mark-group/');
            else if (alert === 'needPayment')
              return navigate('/mark-group/cost/');
            else if (alert === 'needDepartmentName')
              return (window.location.href =
                'https://markcloud.co.kr/mark-mypage');
            else if (alert === 'notAuthority')
              return navigate('/mark-group/business');
            else return;
          }}
        />
      )}
    </>
  );
};

export default SideMenu;
