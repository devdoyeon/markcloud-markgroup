import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonModal from 'common/CommonModal';
import CommonSiteMap from 'common/CommonSiteMap';
import CommonFooter from 'common/CommonFooter';
import SideMenuBtn from 'common/SideMenuBtn';
import { commonModalSetting, catchError } from 'js/commonUtils';
import { checkPoint } from 'js/groupwareApi';
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

  const checkUser = async (code, price, day) => {
    if (!getCookie('myToken')) {
      setAlert('needLogin');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '로그인이 필요한 서비스입니다.'
      );
    } else {
      const result = await checkPoint();
      if (typeof result === 'object') {
        if (
          result?.data?.status?.code === 201 ||
          result?.data?.status?.code === 301
        )
          commonModalSetting(
            setAlertBox,
            true,
            'alert',
            '이미 사용 중인 그룹웨어 이용권이 있습니다.'
          );
        else if (result?.data?.status?.code === 302)
          commonModalSetting(
            setAlertBox,
            true,
            'alert',
            '사용자 계정은 결제가 불가합니다.'
          );
        else
          navigate('/mark-groupware/payment', {
            state: {
              merchant_code: code,
              money: price,
              day: day,
            },
          });
      } else catchError(result, navigate, setAlertBox, setAlert);
    }
  };

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
                <button onClick={() => checkUser('MV180', 1500000, 180)}>
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
                <button onClick={() => checkUser('MV365', 2500000, 365)}>
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
            if (alert === 'needLogin') navigate('/mark-groupware/sign-in');
            else return;
          }}
        />
      )}
    </>
  );
};

export default Cost;
