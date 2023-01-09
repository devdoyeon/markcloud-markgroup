import { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CommonSiteMap from 'common/CommonSiteMap';
import CommonFooter from 'common/CommonFooter';
import SideMenuBtn from 'common/SideMenuBtn';
import PaymentStepNav from 'common/PaymentStepNav';
import { changeTitle } from 'js/commonUtils';
import PaymentInfo from 'common/PaymentInfo';

const Payment = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  let useDay = 0;
  let money = 0;
  let merchant_code = '';
  let discount = 0.8;
  let discountMoney = 0;
  let totalMoney = 0;

  //= 결제 수단 state
  const [payMethod, setPayMethod] = useState('card');

  //= title 변경
  useEffect(() => {
    changeTitle('그룹웨어 > 결제');
  }, []);

  //=props 값 없을시 error page로 이동
  if (!location?.state) navigate('/mark-groupware/error');
  else {
    merchant_code = location?.state?.merchant_code;
    useDay = location?.state?.day;
    money = location?.state?.money;
    discountMoney = money * 0.2;
    totalMoney = money * discount;
  }

  const curData = {
    merchant_code,
    money,
    discountMoney,
    totalMoney,
    useDay,
    payMethod,
    setPayMethod,
  };

  return (
    <>
      <SideMenuBtn />
      <CommonSiteMap color='black' />
      <section className='payment-home'>
        <div className='content-container'>
          <PaymentStepNav step={1} />
          <main className='payment-content'>
            <PaymentInfo curData={curData} />
          </main>
        </div>
      </section>
      <CommonFooter />
    </>
  );
});

export default Payment;
