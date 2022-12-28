import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonModal from 'common/CommonModal';
import CommonSiteMap from 'common/CommonSiteMap';
import CommonFooter from 'common/CommonFooter';
import SideMenuBtn from 'common/SideMenuBtn';
import { commonModalSetting } from 'js/commonUtils';
import { getCookie } from 'js/cookie';
import costBg from 'image/costBg.png';

const Cost = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const navigate = useNavigate();

  return (
    <>
      <div className='container'>
        <SideMenuBtn />
        <CommonSiteMap color='black' />
        <div className='cost'>
          <img src={costBg} alt='요금제 안내 이미지' />
          <div className='row'>
            <div>
              <div>
                <strong className='bold'>180일권</strong>
                <p className='cost-money bold'>
                  <span>20%</span>1,500,000원
                </p>
                <span className='cost-discount bold'>1,200,000원</span>
                <div className='cost-dashed'></div>
                <p className='cost-desc'>
                  마크그룹웨어 서비스
                  <br />
                  180일 이용권
                </p>
                <button
                  onClick={() => {
                    if (!getCookie('myToken')) {
                      setAlert('needLogin');
                      commonModalSetting(
                        setAlertBox,
                        true,
                        'alert',
                        '로그인이 필요한 서비스입니다.'
                      );
                    } else
                      navigate('/payment', {
                        state: {
                          merchant_code: 'MV180',
                          money: 1500000,
                          day: 180,
                        },
                      });
                  }}>
                  구매하기
                </button>
              </div>
            </div>
            <div>
              <div>
                <strong className='bold'>365일권</strong>
                <p className='cost-money bold'>
                  <span>20%</span>2,500,000원
                </p>
                <span className='cost-discount bold'>2,000,000원</span>
                <div className='cost-dashed'></div>
                <p className='cost-desc'>
                  마크그룹웨어 서비스
                  <br />
                  365일 이용권
                </p>
                <button
                  onClick={() => {
                    if (!getCookie('myToken')) {
                      setAlert('needLogin');
                      commonModalSetting(
                        setAlertBox,
                        true,
                        'alert',
                        '로그인이 필요한 서비스입니다.'
                      );
                    } else
                      navigate('/payment', {
                        state: {
                          merchant_code: 'MV365',
                          money: 2500000,
                          day: 365,
                        },
                      });
                  }}>
                  구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'needLogin') navigate('/sign-in')
            else return;
          }}
        />
      )}
    </>
  );
};

export default Cost;
