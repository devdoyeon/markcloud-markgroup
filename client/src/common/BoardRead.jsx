import React from 'react';

const BoardRead = ({ header, curdata }) => {
  return (
    <>
      <div className='header'>
        <h3>{header}</h3>
      </div>
      <div className='board-wrap'>
        <div className='header'>
          <h4>{curdata}</h4>
        </div>
        <div className='body-wrap'>
          <div className='writer'>
            <span>작성자</span>
            <div>{curdata}</div>
          </div>
          <div className='date'>
            <span>작성일</span>
            <div>{curdata}</div>
          </div>
          <div className='line'></div>
          <div className='content'>{curdata}</div>
        </div>
      </div>
      <div className='btn-wrap'>
        <button className='commonBtn'>수정</button>
        <button className='commonBtn list'>목록</button>
      </div>
    </>
  );
};

export default BoardRead;
