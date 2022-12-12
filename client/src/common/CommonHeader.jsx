import searchIcon from 'image/searchIcon.svg';
import { useState } from 'react';
import selectArrow from 'image/selectArrow.svg';

// 자주 쓰이는 헤더
const CommonHeader = ({ header }) => {
  const [filter, setFilter] = useState('title');
  const [select, setSelect] = useState('off');

  return (
    <>
      <div className='header'>
        <h3>{header}</h3>
      </div>
      <div className='search-wrap'>
        <div className='search'>
          <div className='selectBox'>
            <div
              className='selectVal'
              onClick={() =>
                select === 'on' ? setSelect('off') : setSelect('on')
              }>
              {filter === 'title' ? '제목' : '작성자'}
              <img src={selectArrow} alt='선택 아이콘' />
            </div>
            {select === 'on' && (
              <div className='selectOptGroup'>
                <div
                  className='selectOpt'
                  onClick={() => {
                    setFilter('title');
                    setSelect('off');
                  }}>
                  제목
                </div>
                <div
                  className='selectOpt'
                  onClick={() => {
                    setFilter('writer');
                    setSelect('off');
                  }}>
                  작성자
                </div>
              </div>
            )}
          </div>
          <input type='text' />
          <button>
            <img src={searchIcon} alt='검색 아이콘' />
          </button>
        </div>
      </div>
    </>
  );
};

export default CommonHeader;
