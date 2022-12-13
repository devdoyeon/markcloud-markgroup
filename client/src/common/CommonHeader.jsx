import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import searchIcon from 'image/searchIcon.svg';
import selectArrow from 'image/selectArrow.svg';

// 자주 쓰이는 헤더
const CommonHeader = ({ filter, setFilter, setSearchText, searchText }) => {
  const path = useLocation().pathname;
  const [select, setSelect] = useState('off');

  const returnHeader = () => {
    if (path.includes('/board')) return '사내게시판';
    else if (path.includes('/notice')) return '공지사항';
    else if (path.includes('/weekly')) return '주간업무보고';
  };

  return (
    <>
      <div className='header'>
        <h3>{returnHeader()}</h3>
      </div>
      <div className='search-wrap'>
        <div className='search'>
          <div className='selectBox'>
            <div
              className={`selectVal ${select}`}
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
                    setFilter('created_id');
                    setSelect('off');
                  }}>
                  작성자
                </div>
                <div
                  className='selectOpt'
                  onClick={() => {
                    setFilter('title');
                    setSelect('off');
                  }}>
                  제목
                </div>
              </div>
            )}
          </div>
          <input
            type='text'
            placeholder='검색어를 입력해 주세요.'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button>
            <img src={searchIcon} alt='검색 아이콘' />
          </button>
        </div>
      </div>
    </>
  );
};

export default CommonHeader;
