import { useLocation, useNavigate } from 'react-router-dom';
import Tools from './Tools';

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
          게시판
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
      <Tools />
    </div>
  );
};

export default SideMenu;
