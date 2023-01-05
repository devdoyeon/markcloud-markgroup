import { FaCheckCircle, FaCreditCard } from 'react-icons/fa';

const PaymentStepNav = ({ step }) => {
  return (
    <ul>
      <li className={step === 1 ? 'active' : ''}>
        <FaCreditCard />
        주문/결제
      </li>
      <li className={step === 2 ? 'active' : ''}>
        <FaCheckCircle />
        결제완료
      </li>
    </ul>
  );
};

export default PaymentStepNav;
