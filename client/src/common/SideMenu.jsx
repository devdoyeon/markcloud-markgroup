import { useLocation, useNavigate } from 'react-router-dom';
import sampleImg from 'image/sample.jpg';
import rightArrow from 'image/rightArrow.svg';

const SideMenu = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <div className='sidebar'>
      <ul>
        <li
          className={path === '/business' && 'active'}
          onClick={() => navigate('/business')}>
          업무관리
        </li>
        <li
          className={path === '/project' && 'active'}
          onClick={() => navigate('/project')}>
          프로젝트현황
        </li>
        <li
          className={path === '/weekly' && 'active'}
          onClick={() => navigate('/weekly')}>
          주간업무보고
        </li>
        <li
          className={path === '/notice' && 'active'}
          onClick={() => navigate('/notice')}>
          공지사항
        </li>
        <li
          className={path === '/board' && 'active'}
          onClick={() => navigate('/board')}>
          사내게시판
        </li>
        <li
          className={path === '/personnel' && 'active'}
          onClick={() => navigate('/personnel')}>
          인사관리
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
      <div className='help'>도움말</div>
      <div className='logoutBtn'>로그아웃</div>
      <div className='row'>
        <div className='row user'>
          <img src={sampleImg} alt='프로필 사진 샘플' />
          <span>사용자</span>
        </div>
        <img src={rightArrow} alt='더보기' />
      </div>
    </div>
    </div>
  );
};

export default SideMenu;
