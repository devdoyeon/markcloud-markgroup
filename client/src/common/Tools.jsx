import React from 'react';
import sampleImg from 'image/sample.jpg';
import rightArrow from 'image/rightArrow.svg';

const Tools = () => {
  return (
    <div className='column tools'>
      <div className='help'>도움말</div>
      <div className='logoutBtn'>로그아웃</div>
      <div className='row'>
        <div className='row user'>
          <img src={sampleImg} alt='프로필 사진 샘플' />
          <span>사용자</span>
        </div>
        <img src={rightArrow} alt='더보기' />
      </div>
    </div>
  );
};

export default Tools;
