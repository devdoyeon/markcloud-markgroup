import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMinusCircle, FaPauseCircle } from 'react-icons/fa';
import CommonModal from './CommonModal';
import { catchError, commonModalSetting } from 'js/commonUtils';
import { createMID, checkPay } from 'js/groupwareApi';

const PaymentInfo = memo(({ curData }) => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const navigate = useNavigate();
  const addComma = str => {
    if (!str) return '';
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const {
    merchant_code,
    money,
    discountMoney,
    totalMoney,
    useDay,
    payMethod,
    setPayMethod,
  } = curData;

  const [alertMsg, setAlertMsg] = useState('');

  //월, 일이 한자리일 경우 '0'추가하는 함수
  const addZero = val => {
    return val < 10 ? '0' + val : val;
  };

  //가상계좌 입금기한 설정
  const dueDate = () => {
    const date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate() + 3;

    month = addZero(month);
    day = addZero(day);

    return date.getFullYear() + month + day;
  };

  //사용기간 계산
  const culDate = (n, m) => {
    let date = new Date();
    let start = new Date(Date.parse(date) + n * 1000 * 60 * 60 * 24);
    let today = new Date(Date.parse(date) + m * 1000 * 60 * 60 * 24);

    if (n < 10) {
      start.setMonth(start.getMonth() - n);
    }
    //현재 날짜 정보 변수
    let yyyy = start.getFullYear();
    let mm = start.getMonth() + 1;
    let dd = start.getDate();

    //바뀔 날짜 정보 변수
    let c_yyyy = today.getFullYear();
    let c_mm = today.getMonth() + 1;
    let c_dd = today.getDate();
    return (
      yyyy +
      '.' +
      addZero(mm) +
      '.' +
      addZero(dd) +
      ' ~ ' +
      c_yyyy +
      '.' +
      addZero(c_mm) +
      '.' +
      addZero(c_dd)
    );
  };

  let bool = false;
  let paymentParams = [];

  //주문번호 및 구매자 정보 조회
  const paymentProcess = async () => {
    const data = { merchant_code: merchant_code };
    const result = await createMID(data);
    if (typeof resultData === 'object') {
      paymentParams = result?.data?.data;
      bool = true;
      if (bool) requestPay();
    } else catchError(result, navigate, setAlertBox, setAlert);
  };

  let payResult = [];

  //결제창 호출
  const requestPay = () => {
    let IMP = window.IMP;
    IMP.request_pay(
      {
        //param
        pg: 'html5_inicis', //pg사
        pay_method: payMethod, //결제수단
        merchant_uid: paymentParams.merchant_uid, //주문번호(yyyymmdd시간)
        name: paymentParams.name, //상품명
        amount: paymentParams.amount, //상품금액
        buyer_email: paymentParams.buyer_email, //구매자 이메일
        buyer_name: paymentParams.buyer_name, //구매자 이름
        buyer_tel: paymentParams.buyer_tel, //구매자 연락처(필수 입력-미설정 시 이니시스 결제창에서 오류 발생 가능)
        buyer_addr: paymentParams.buyer_addr, //구매자 주소
        buyer_postcode: paymentParams.buyer_postcode, //구매자 우편번호
        digital: true, //실제 물품인지 무형의 상품인지(핸드폰 결제에서 필수 파라미터)
        display: {
          card_quota: [2, 3], //할부개월수
        },
        vbank_due: dueDate(), //가상계좌 입금기한(입금기한 설정되면 사용자가 수정 불가)
      },
      async function (rsp) {
        //callback
        if (rsp.success) {
          // 결제 성공 시 로직,
          const data = {
            merchant_uid: rsp.merchant_uid,
            imp_uid: rsp.imp_uid,
          };
          const result = await checkPay(data);
          if (typeof result === 'object') {
            payResult = result?.data.data;
            navigate('/payment-success', {
              state: {
                payResult: payResult,
                merchant_uid: rsp.merchant_uid,
              },
            });
          } else catchError(result, navigate, setAlertBox, setAlert);
        } else {
          // 결제 실패 시 로직,
          setAlertMsg('error_payment');
        }
      }
    );
  };

  return (
    <>
      <div className='v-order-home'>
        <p className='v-payment-title'>주문내역</p>
        <div className='cost-border-box'>
          <table>
            <thead>
              <tr>
                <th>상품명</th>
                <th>사용기간</th>
                <th className='mobile-none'>금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  마크그룹웨어 <br className='mobile-only' />
                  {useDay}일권
                </td>
                <td>{culDate(0, useDay)}</td>
                <td className='mobile-none'>{addComma(money)}원</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li>
              <p>상품금액</p>
              <strong>
                {addComma(money)}
                <span>원</span>
              </strong>
            </li>
            <li>
              <FaMinusCircle />
            </li>
            <li>
              <p>할인금액</p>
              <strong>
                {addComma(discountMoney)}
                <span>원</span>
              </strong>
            </li>
            <li>
              <FaPauseCircle className='fa-pause-circle' />
            </li>
            <li>
              <p>총 결제예정금액</p>
              <strong className='highlight red'>
                {addComma(totalMoney)}
                <span>원</span>
              </strong>
            </li>
          </ul>
        </div>
      </div>
      <div className='v-method-home'>
        <p className='v-payment-title'>결제방법</p>
        <div className='cost-border-box'>
          <label>
            <input
              type='radio'
              name='method'
              value='card'
              onChange={e => setPayMethod(e.target.value)}
              checked={payMethod === 'card' ? true : false}
            />
            <span>카드결제</span>
          </label>
          <label>
            <input
              type='radio'
              name='method'
              value='vbank'
              onChange={e => setPayMethod(e.target.value)}
              checked={payMethod === 'vbank' ? true : false}
            />
            <span>무통장결제</span>
          </label>
        </div>
      </div>
      <button className='commonBtn' onClick={paymentProcess}>
        결제하기
      </button>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'deleteConfirm');
            else return;
          }}
        />
      )}
    </>
  );
});

export default PaymentInfo;
