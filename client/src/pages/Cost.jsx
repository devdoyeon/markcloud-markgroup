import { Link } from 'react-router-dom';
import CommonSiteMap from 'common/CommonSiteMap';
import CommonFooter from 'common/CommonFooter';
import costBg from 'image/costBg.png';

const Cost = () => {
  return (
    <div className='container'>
      <CommonSiteMap color='black' />
      <div className='cost'>
        <img src={costBg} alt='요금제 안내 이미지' />
        <div className='row'>
          <div>
            <div>
              <strong className='bold'>180일권</strong>
              <p className='v-cost-money bold'>
                <span>20%</span>1,500,000원
              </p>
              <span className='v-cost-discount bold'>1,200,000원</span>
              <div className='v-cost-dashed'></div>
              <p className='v-cost-desc'>
                마크그룹웨어 서비스
                <br />
                180일 이용권
              </p>
              <Link
                to='/payment'
                state={{ merchant_code: 'GW180', money: 1500000, day: 180 }}>
                구매하기
              </Link>
            </div>
          </div>
          <div>
            <div>
              <strong className='bold'>365일권</strong>
              <p className='v-cost-money bold'>
                <span>20%</span>2,500,000원
              </p>
              <span className='v-cost-discount bold'>2,000,000원</span>
              <div className='v-cost-dashed'></div>
              <p className='v-cost-desc'>
                마크그룹웨어 서비스
                <br />
                365일 이용권
              </p>
              <Link
                to='/payment'
                state={{ merchant_code: 'GW365', money: 2500000, day: 365 }}>
                구매하기
              </Link>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default Cost;
