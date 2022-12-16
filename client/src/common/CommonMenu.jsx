import { useNavigate } from 'react-router-dom';
import { getCookie, removeCookie } from 'js/cookie';

const CommonMenu = () => {
  const navigate = useNavigate();

  return (
    <ul className='commonNav'>
      <li
        onClick={() =>
          getCookie('myToken') ? removeCookie('myToken') : navigate('/sign-in')
        }>
        {getCookie('myToken') ? (
          <button>로그아웃</button>
        ) : (
          <button onClick={() => navigate('/sign-in')}>로그인</button>
        )}
      </li>
      <li>
        {getCookie('myToken') ? (
          <a
            href='https://markcloud.co.kr/mark-mypage'
            rel='noopener noreferrer'
            target='_self'>
            마이페이지
          </a>
        ) : (
          <a
            href='https://markcloud.co.kr/sign-up'
            rel='noopener noreferrer'
            target='_self'>
            회원가입
          </a>
        )}
      </li>
    </ul>
  );
};

export default CommonMenu;
