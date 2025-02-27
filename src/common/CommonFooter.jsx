import $ from 'jquery';
import plusIcon from 'image/plusIcon.svg';
import kakao from 'image/black_kakao.svg';
import naverBlog from 'image/black_blog.svg';
import facebook from 'image/black_facebook.svg';
import instagram from 'image/black_insta.svg';

const CommonFooter = () => {
  const slideList = async () => {
    $('.family-site').stop().slideToggle('fast');
  };

  return (
    <footer className='main-footer'>
      <div className='content-container'>
        <div className='top'>
          <ul>
            <li className='nav-list'>
              <a
                href='https://markcloud.co.kr/mark-business'
                rel='noopener noreferrer'
                target='_self'
                className='bold'>
                회사소개
              </a>
            </li>
            <li className='nav-list'>
              <a
                href='https://markcloud.co.kr/mark-map'
                rel='noopener noreferrer'
                target='_self'
                className='bold'>
                오시는길
              </a>
            </li>
            <li className='nav-list'>
              <a
                href='https://markcloud.co.kr/privacy'
                rel='noopener noreferrer'
                target='_self'
                className='highlight'>
                개인정보처리방침
              </a>
            </li>
            <li className='nav-list'>
              <a
                href='https://markcloud.co.kr/use'
                rel='noopener noreferrer'
                target='_self'
                className='bold'>
                이용약관
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <button onClick={() => slideList()}>
                패밀리사이트
                <img src={plusIcon} alt='플러스 아이콘' />
              </button>
              <ul className='family-site'>
                <li>
                  <a
                    href='https://markcloud.co.kr/'
                    rel='noopener noreferrer'
                    target='_self'
                    className='first'>
                    마크클라우드
                  </a>
                </li>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-view'
                    rel='noopener noreferrer'
                    target='_self'>
                    마크뷰
                  </a>
                </li>
                <li>
                  <a
                    href={`https://markcloud.co.kr/mark-tong`}
                    rel='noopener noreferrer'
                    target='_self'>
                    마크통
                  </a>
                </li>
                <li>
                  <a
                    href='https://markcloud.co.kr/mark-group'
                    rel='noopener noreferrer'
                    target='_self'
                    className='last'>
                    마크그룹
                  </a>
                </li>
              </ul>
            </li>
            <li className='sns-icon'>
              <a
                href='https://blog.naver.com/prologue/PrologueList.naver?blogId=go_markcloud'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={naverBlog} alt='네이버 블로그로 바로가기' />
              </a>
            </li>
            <li className='sns-icon'>
              <a
                href='https://www.instagram.com/mark_cloud_/'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={instagram} alt='인스타그램 바로가기' />
              </a>
            </li>
            <li className='sns-icon'>
              <a
                href='https://www.facebook.com/people/mark_cloud_/100083298100939/'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={facebook} alt='페이스북으로 바로가기' />
              </a>
            </li>
            <li className='sns-icon'>
              <a
                href='https://pf.kakao.com/_Nmwxcxj'
                target='_blank'
                rel='noopener noreferrer'>
                <img src={kakao} alt='카카오톡 상담하기' />
              </a>
            </li>
          </ul>
        </div>
        <div className='bottom'>
          <div>
            <p>
              (주) 마크클라우드에서 운영하는 사이트에서 판매되는 모든 상품은
              (주) 마크클라우드에서 책임지고 있습니다.
            </p>
            <p>
              (주) 마크클라우드 (06193) 서울시 강남구 테헤란로 70길 14-8 A동 4층
              (대치동 890-62) | 대표 : 정상일
              <br />
              사업자등록번호 : 363-86-01485{' '}
              <span className='mobile-none'>|</span>{' '}
              <br className='mobile-only' />
              통신판매업 신고번호 : 제2022-서울 강남-00718호
              <br />
              Email : info@markcloud.co.kr{' '}
              <span className='mobile-none'>|</span>{' '}
              <br className='mobile-only' />
              고객센터 Tel : 02 - 1833 - 4992 | 민원 담당자 : 박정민
            </p>
            <p className='bold'>
              Copyright &copy; markCloud, All rights reserved.
            </p>
          </div>
          <img
            src='https://image.inicis.com/mkt/certmark/inipay/inipay_43x43_gray.png'
            border='0'
            alt='클릭하시면 이니시스 결제시스템의 유효성을 확인하실 수 있습니다.'
            onClick={() =>
              window.open(
                'https://mark.inicis.com/mark/popup_v3.php?mid=MOImarkclo',
                'mark',
                'scrollbars=no,resizable=no,width=565,height=683'
              )
            }
            className='commonFooter mobile-none'
          />
        </div>
      </div>
    </footer>
  );
};

export default CommonFooter;
