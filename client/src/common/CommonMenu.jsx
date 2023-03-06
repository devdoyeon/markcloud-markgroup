import { Link } from 'react-router-dom';
import { getCookie, removeCookie } from 'js/cookie';

const CommonMenu = () => {
  return (
    <ul className='commonNav'>
      <li>
        {getCookie('myToken') ? (
          <button
            onClick={() => {
              removeCookie('myToken', {
                path: '/',
                domain: 'markcloud.co.kr',
              });
              removeCookie('rfToken', {
                path: '/',
                domain: 'markcloud.co.kr',
              });
              localStorage.clear();
              window.location.reload();
              return;
            }}>
            로그아웃
          </button>
        ) : (
          <Link to='/mark-group/sign-in'>로그인</Link>
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
