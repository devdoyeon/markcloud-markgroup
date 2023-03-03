import { useEffect, useState } from 'react';

import cloudIcon from 'image/sideBtnIcon01.png';
import viewIcon from 'image/sideBtnIcon02.png';
import tongIcon from 'image/sideBtnIcon03.png';
import groupwareIcon from 'image/sideBtnIcon04.svg';
// import linkIcon from 'image/sideBtnIcon05.png';

const SideMenuBtn = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showBtn, setShowBtn] = useState(false);
  const [listActive, setListActive] = useState(false);

  const scrollYFn = async setScrollY => {
    const scrollYHandler = () => setScrollY(window.pageYOffset);
    const watch = () => window.addEventListener('scroll', scrollYHandler);
    watch();
    return () => window.removeEventListener('scroll', scrollYHandler);
  };

  //scroll Event
  useEffect(() => {
    scrollYFn(setScrollY);
    if (scrollY > 100) setShowBtn(true);
    else if (scrollY <= 100) {
      setListActive(false);
      setShowBtn(false);
    }
    return () => {
      setListActive(false);
      setShowBtn(false);
    };
  }, [scrollY]);

  //scrollTop 버튼 함수
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <aside className={showBtn ? 'side-home active' : 'side-home'}>
      <div>
        <button
          className='page-move-btn'
          onClick={() => setListActive(!listActive)}></button>
        <ul className={listActive ? 'active' : ''}>
          <li>
            <a
              href='https://markcloud.co.kr/'
              rel='noopener noreferrer'
              target='_self'
              title='마크클라우드로 이동'>
              <img src={cloudIcon} alt='마크클라우드 아이콘' />
              <span className='middle'>MARKCLOUD</span>
            </a>
          </li>
          <li>
            <a
              href='https://markcloud.co.kr/mark-view'
              rel='noopener noreferrer'
              target='_self'
              title='마크뷰로 이동'>
              <img src={viewIcon} alt='마크뷰 아이콘' />
              <span className='middle'>MARKVIEW</span>
            </a>
          </li>
          <li>
            <a
              href={`https://markcloud.co.kr/mark-tong`}
              rel='noopener noreferrer'
              target='_self'
              title='마크통으로 이동'>
              <img src={tongIcon} alt='마크통 아이콘' />
              <span className='middle'>MARKTONG</span>
            </a>
          </li>
          <li>
            <a
              href='https://markcloud.co.kr/mark-groupware'
              rel='noopener noreferrer'
              target='_self'
              title='마크그룹웨어로 이동'>
              <img src={groupwareIcon} alt='마크그룹웨어 아이콘' />
              <span className='middle'>GROUPWARE</span>
            </a>
          </li>
          {/* <li>
            <a
              href='/mark-link'
              rel='noopener noreferrer'
              target='_self'
              title='마크링크로 이동'>
              <img src={linkIcon} alt='마크링크 아이콘' />
              <span className='middle'>MARK LINK</span>
            </a>
          </li> */}
          <li></li>
        </ul>
      </div>
      <button className='scroll-top-btn' onClick={() => scrollTop()}></button>
    </aside>
  );
};

export default SideMenuBtn;
