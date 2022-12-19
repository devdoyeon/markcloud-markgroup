import { useLocation, useNavigate } from 'react-router-dom';
import { removeCookie } from 'js/cookie';
import rightArrow from 'image/rightArrow.svg';
import goHomeIcon from 'image/goHomeIcon.svg';
import mainLogo from 'image/groupware-logo.png';

const SideMenu = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <div className='sidebar'>
      <img
        src={mainLogo}
        alt='마크그룹 로고'
        onClick={() => navigate('/business')}
      />
      <ul>
        <li
          className={path.includes('/business') && 'active'}
          onClick={() => navigate('/business')}>
          업무 관리
        </li>
        <li
          className={path.includes('/project') && 'active'}
          onClick={() => navigate('/project')}>
          프로젝트 현황
        </li>
        <li
          className={path.includes('/report') && 'active'}
          onClick={() => navigate('/report')}>
          주간 업무 보고
        </li>
        <li
          className={path.includes('/notice') && 'active'}
          onClick={() => navigate('/notice')}>
          공지사항
        </li>
        <li
          className={path.includes('/board') && 'active'}
          onClick={() => navigate('/board')}>
          게시판
        </li>
        <li
          className={path.includes('/personnel') && 'active'}
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
      </ul>
      <div className='column tools'>
        <div className='go-home' onClick={() => navigate('/')}>
          <img src={goHomeIcon} alt='홈으로 가기 아이콘' />
        </div>
        <div className='logoutBtn' onClick={() => removeCookie('myToken')}>
          로그아웃
        </div>
        <div className='row'>
          <span>사용자(user0101)</span>
          <img src={rightArrow} alt='더보기 아이콘' />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
