import React from 'react';

const BoardRead = ({ header, curData }) => {
  return (
    <>
      <div className='header'>
        <h3>{header}</h3>
      </div>
      <div className='board-wrap'>
        <div className='header'>
          <h4>{curData}</h4>
        </div>
        <div className='body-wrap'>
          <div className='writer'>
            <span>작성자</span>
            <div>{curData}</div>
          </div>
          <div className='date'>
            <span>작성일</span>
            <div>{curData}</div>
          </div>
          <div className='line'></div>
          <div className='content'>{curData}</div>
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
