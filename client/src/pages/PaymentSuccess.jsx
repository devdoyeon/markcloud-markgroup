import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentStepNav from 'common/PaymentStepNav';
import CommonSiteMap from 'common/CommonSiteMap';
import CommonFooter from 'common/CommonFooter';
import SideMenuBtn from 'common/SideMenuBtn';
import { changeTitle, addComma } from 'js/commonUtils';

const PaymentSuccess = () => {
  //= props값 없을 시 error page로 이동
  const location = useLocation();

  if (!location?.state) {
    window.location.href = '/error';
  }

  const splitDate = (str, type) => {
    if (!str) return '';
    var splitArr = str.split('T');
    if (!type)
      return splitArr[0].replaceAll('-', '.') + '. ' + splitArr[1].slice(0, -3);
    else return splitArr[0].replaceAll('-', '.');
  };

  const { name, paid_amount, paid_status, vbank_date, vbank_name, vbank_num } =
    location?.state?.payResult;
  const { merchant_uid } = location?.state.merchant_uid;
  const appendData = `
        'ecommerce':{
            'purchase':{
                'actionField':{
                    'id'        :   '${merchant_uid}',
                    'revenue'   :   '${paid_amount}',
                    'name'      :   '${name}',
                    'price'     :   '${paid_amount}',
                    'quantity'  :    ${1}
                }
            }
        }`;

  //= dataLayer 추가
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `window.dataLayer = window.dataLayer || [];
        dataLayer.push({${appendData}})`;
    document.head.append(script);
  }, [appendData]);

  //= title 변경
  useEffect(() => {
    changeTitle('그룹웨어 > 결제 성공');
  }, []);

  return (
    <section className='payment-home'>
      <SideMenuBtn />
      <CommonSiteMap color='black' />
      <div className='content-container'>
        <PaymentStepNav step={2} />
        <main className='payment-content'>
          <div className='payment-success'>
            {paid_status === 'paid' ? (
              <>
                <h2>
                  구매가 정상적으로{' '}
                  <span className='highlight'>완료되었습니다.</span>
                </h2>
                <div>
                  <h3>
                    <br />
                    <span className='highlight'>{name}</span>
                  </h3>
                  <h4>
                    총 결제금액&nbsp;
                    <span className='bold'>{addComma(paid_amount)}</span>
                  </h4>
                </div>
              </>
            ) : (
              <>
                <h2>
                  가상계좌가 <span className='highlight'>발급되었습니다.</span>
                </h2>
                <div>
                  <h3>
                    아래 가상계좌로 입금해 주시면 정상적으로
                    <br />
                    결제 완료 처리가 됩니다.
                  </h3>
                  <ul>
                    <li className='title-li'>계좌 정보</li>
                    <li>- 은행명 : {vbank_name}</li>
                    <li>- 계좌번호 : {vbank_num}</li>
                    <li>- 예금주 : (주) 마크클라우드</li>
                    <li className='title-li'>결제 금액</li>
                    <li>{addComma(paid_amount)}원</li>
                    <li className='title-li'>입금 기간</li>
                    <li>{splitDate(vbank_date)} 까지</li>
                  </ul>
                </div>
              </>
            )}
            <div className='btn-wrap'>
              <a
                href='https://markcloud.co.kr/mark-mypage'
                rel='noopener noreferrer'
                target='_self'>
                <button className='commonBtn go-list'>구매내역 보기</button>
              </a>
              <a href='/' rel='noopener noreferrer' target='_self'>
                <button className='commonBtn okBtn'>확인</button>
              </a>
            </div>
          </div>
        </main>
      </div>
      <CommonFooter />
    </section>
  );
};

export default PaymentSuccess;
