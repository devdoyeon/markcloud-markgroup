import { useEffect } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import CommonMenu from './CommonMenu';

import kakao from 'image/kakao.svg';
import naverBlog from 'image/naver_blog.svg';
import facebook from 'image/facebook.svg';
import instagram from 'image/insta.svg';

const CommonSiteMap = ({ color }) => {
  const headerHoverEvent = () => {
    const main = '.main-nav';
    const sub = '.sub-nav';
    const bg = '.sub-nav-bg';
    const speed = 300;
    $(main).mouseenter(function () {
      $('.common-header').css({
        backgroundColor: 'rgba(21, 23, 26, 0.5)',
        borderBottom: '1px solid #FFFFFF',
      });
      $(sub + ',' + bg)
        .stop()
        .slideUp(0);
      $(this).next().stop().slideDown(speed);
      $(bg).stop().slideDown(speed);
      $(this)
        .parent()
        .mouseleave(function () {
          $(this).find(sub).stop().slideUp(speed);
          $(bg).stop().slideUp(speed);
          $('.common-header').css({
            backgroundColor: 'transparent',
            borderBottom: 'none',
          });
        });
    });
  };

  //= header hover Event 실행
  useEffect(() => {
    headerHoverEvent();
  }, []);

  return (
    <header
      className={`common-header ${color === 'black' ? 'black-header' : ''}`}>
      <div className='header-container'>
        <nav>
          <ul>
            <li>
              <Link to='/mark-group/' className='main-move' />
            </li>
            <li>
              <Link to='/mark-group/cost'>요금제 안내</Link>
            </li>
            <li>
              <a
                href='https://markcloud.co.kr/mark-notice/'
                rel='noopener noreferrer'
                target='_self'
                className='main-nav'>
                고객지원
              </a>
              <ul className='sub-nav'>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-notice/'
                    rel='noopener noreferrer'
                    target='_self'>
                    공지사항
                  </a>
                </li>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-faq/'
                    rel='noopener noreferrer'
                    target='_self'>
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-qna'
                    rel='noopener noreferrer'
                    target='_self'>
                    상표 Q&A
                  </a>
                </li>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-inquiry/'
                    rel='noopener noreferrer'
                    target='_self'>
                    1:1 문의
                  </a>
                </li>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-refund/'
                    rel='noopener noreferrer'
                    target='_self'>
                    환불 안내
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className='sns-nav'>
            <li>
              <a
                href='https://blog.naver.com/prologue/PrologueList.naver?blogId=go_markcloud'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={naverBlog} alt='네이버 블로그로 바로가기' />
              </a>
            </li>
            <li>
              <a
                href='https://www.instagram.com/mark_cloud_/'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={instagram} alt='인스타그램 바로가기' />
              </a>
            </li>
            <li>
              <a
                href='https://www.facebook.com/people/mark_cloud_/100083298100939/'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={facebook} alt='페이스북으로 바로가기' />
              </a>
            </li>
            <li>
              <a
                href='https://pf.kakao.com/_Nmwxcxj'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={kakao} alt='카카오톡 상담하기' />
              </a>
            </li>
          </ul>
          <CommonMenu />
        </nav>
      </div>
      <div className='sub-nav-bg'></div>
    </header>
  );
};

export default CommonSiteMap;
