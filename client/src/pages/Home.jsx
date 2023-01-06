import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonFooter from 'common/CommonFooter';
import CommonModal from 'common/CommonModal';
import CommonSiteMap from 'common/CommonSiteMap';
import SideMenuBtn from 'common/SideMenuBtn';
import { changeTitle, commonModalSetting, catchError } from 'js/commonUtils';
import { checkUserInfo, checkPoint } from 'js/groupwareApi';
import { getCookie } from 'js/cookie';
import mainBg from 'image/mainBg.png';
import goIcon from 'image/goIcon.svg';
import sub00 from 'image/groupware-main01.png';
import sub01 from 'image/groupware-main03.png';
import sub02 from 'image/groupware-main02.png';
import quoteIcon from 'image/quoteIcon.svg';
import business from 'image/businessIcon.svg';
import project from 'image/projectIcon.svg';
import report from 'image/reportIcon.svg';
import notice from 'image/noticeIcon.svg';
import board from 'image/boardIcon.svg';
import personnel from 'image/personnelIcon.svg';
import companyImg from 'image/companyImg.jpg';

const Home = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    changeTitle('그룹웨어 > 메인');
  }, []);

  //= 체크포인트
  const navigateHandling = async () => {
    if (!getCookie('myToken')) {
      commonModalSetting(
        setAlertBox,
        true,
        'confirm',
        '로그인이 필요한 서비스입니다.<br/>로그인 하시겠습니까?'
      );
      setAlert('needLogin');
    } else {
      const checkResult = await checkPoint();
      if (typeof checkResult === 'object') {
        if (checkResult?.data?.data === 'none') {
          setAlert('needDepartmentName');
          commonModalSetting(
            setAlertBox,
            true,
            'confirm',
            '회사명 입력이 필요합니다.<br/>회원 정보 변경 페이지로 이동하시겠습니까?'
          );
          return;
        } else if (checkResult?.data?.status?.code === 303) {
          setAlert('needPayment');
          commonModalSetting(
            setAlertBox,
            true,
            'confirm',
            '유료 결제가 필요합니다.<br/>요금제 안내 페이지로 이동하시겠습니까?'
          );
          return;
        } else if (
          checkResult?.data?.status?.code === 201 ||
          checkResult?.data?.status?.code === 301 ||
          checkResult?.data?.status?.code === 302
        ) {
          const userResult = await checkUserInfo();
          if (typeof userResult === 'object') {
            const { name, user_id } = userResult?.data?.data;
            localStorage.setItem('userName', name);
            localStorage.setItem('userId', user_id);
            navigate('/gp/business');
          } else return catchError(userResult, navigate, setAlertBox, setAlert);
        }
      } else catchError(checkResult, navigate, setAlertBox, setAlert);
    }
  };

  return (
    <>
      <SideMenuBtn />
      <div className='main container column'>
        <CommonSiteMap color='white' />
        <div className='mainContent-wrap'>
          <div className='intro'>
            <div className='intro-content'>
              <h3>
                IT 전문 기업이 만든
                <br />
                협업 서비스
              </h3>
              <p>
                MarkCloud의 기술력으로 모든 회사에 필요한 기능만 최소화하여
                <br />
                담아냈습니다.
              </p>
              <button onClick={navigateHandling}>
                그룹웨어 바로가기 <img src={goIcon} alt='바로가기 아이콘' />
              </button>
            </div>
            <img src={mainBg} alt='' />
          </div>
          <div className='middle'>
            <div className='middle-section'>
              <div className='middle-content'>
                <h3>
                  그룹웨어의 모든 것,
                  <br />
                  모든 것을 품은 그룹웨어
                </h3>
                <p>
                  빠르게 발전하고 있는 Smart IT 세상,
                  <br />
                  MarkCloud가 함께합니다.
                </p>
              </div>
            </div>
            <div className='middle-img'>
              <div>
                <img src={sub00} alt='메인 페이지 소개 이미지 1' />
              </div>
              <div></div>
              <div>
                <img src={sub01} alt='메인 페이지 소개 이미지 2' />
              </div>
              <div>
                <img src={sub02} alt='메인 페이지 소개 이미지 3' />
              </div>
              <div className='middle-decoration'>
                <hr />
                <span>Let's work easy</span>
              </div>
            </div>
          </div>
          <div className='service'>
            <div className='row'>
              <img src={quoteIcon} alt='따옴표 아이콘' />
              <div className='service-content'>
                <h5>
                  일하기 좋은 회사를
                  <br />
                  만드는 필수 기능 제공
                </h5>
                <p>
                  빠르게 발전하고 있는 Smart IT 세상, MarkCloud가 함께합니다.
                </p>
              </div>
            </div>
            <hr />
            <div className='service-explanation column'>
              <div className='row'>
                <div className='column'>
                  <div className='row'>
                    <img src={business} alt='업무 관리 아이콘' />
                    <span>업무 관리</span>
                  </div>
                  <span className='info'>
                    업무 요청, 처리 결과, 업무 완료까지
                    <br />
                    그룹웨어를 통한 전반적인 관리가 가능합니다.
                  </span>
                </div>
                <div className='column'>
                  <div className='row'>
                    <img src={project} alt='프로젝트 현황 아이콘' />
                    <span>프로젝트 현황</span>
                  </div>
                  <span className='info'>
                    프로젝트 정보 공유로 업무 효율성이 증대되며,
                    <br />
                    축적된 데이터를 사내 통계 자료로
                    <br />
                    활용 가능합니다.
                  </span>
                </div>
                <div className='column'>
                  <div className='row'>
                    <img src={report} alt='주간 업무 보고 아이콘' />
                    <span>주간 업무 보고</span>
                  </div>
                  <span className='info'>
                    주간 업무 보고 및 확인으로 업무 진행도
                    <br />
                    파악에 따른 효율성 증대가 이루어집니다.
                  </span>
                </div>
              </div>
              <div className='row'>
                <div className='column'>
                  <div className='row'>
                    <img src={notice} alt='공지사항 아이콘' />
                    <span>공지사항</span>
                  </div>
                  <span className='info'>
                    모든 임직원에게 사내 공지사항을 통한
                    <br />
                    정보 전달이 가능합니다.
                  </span>
                </div>
                <div className='column'>
                  <div className='row'>
                    <img src={board} alt='게시판 아이콘' />
                    <span>게시판</span>
                  </div>
                  <span className='info'>
                    사내 게시판을 통한 사원들간의
                    <br />
                    정보 공유 및 활용이 가능합니다.
                  </span>
                </div>
                <div className='column'>
                  <div className='row'>
                    <img src={personnel} alt='인사 관리 아이콘' />
                    <span>인사 관리</span>
                  </div>
                  <span className='info'>
                    사원들의 인사 정보와 개인 정보를
                    <br />
                    웹으로 관리하여 정보 보안 및 수정에
                    <br />
                    용이합니다.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='company-explanation'>
            <div className='section'>
              <div className='company-content'>
                <h5>What is company for?</h5>
                <h3>MarkCloud</h3>
                <span>
                  현 분야 최고의 기업으로 나아가기 위한 끊임없는 연구와 도전
                  정신을 지향합니다.
                </span>
                <p>
                  업무의 시작과 끝, 그룹웨어 하나로
                  <br />
                  협업을 위한 가장 편리한 서비스, 그룹웨어
                  <br />
                  마크클라우드 그룹웨어에서 담아냈습니다.
                </p>
              </div>
            </div>
            <div className='company-img'>
              <div>
                <img src={companyImg} alt='회사 이미지' />
              </div>
              <div className='company-decoration'>
                <span>All the services you need it</span>
                <hr />
              </div>
            </div>
          </div>
          <div className='start-groupware column'>
            <h3>지금 시작해 보세요!</h3>
            <span>
              MarkCloud의 기술력으로 모든 회사에 필요한 기능만 최소화하여
              담아냈습니다.
            </span>
            <button onClick={navigateHandling}>
              그룹웨어 바로가기 <img src={goIcon} alt='바로가기 아이콘' />
            </button>
          </div>
          <CommonFooter />
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'needLogin') return navigate('/gp/sign-in');
            else if (alert === 'duplicateLogin') return navigate('/gp/sign-in');
            else if (alert === 'needPayment') return navigate('/gp/cost');
            else if (alert === 'needDepartmentName')
              return (window.location.href =
                'https://markcloud.co.kr/mark-mypage');
            else if (alert === 'tokenExpired') navigate('/gp/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default Home;
