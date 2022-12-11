import searchIcon from 'image/searchIcon.svg';

// 자주 쓰이는 헤더
const CommonHeader = ({ header }) => {
  return (
    <>
      <div className='header'>
        <h3>{header}</h3>
      </div>
      <div className='search-wrap'>
        <div className='search'>
          <select>
            <option value='title'>제목</option>
            <option value='writer'>작성자</option>
            <option value='content'>내용</option>
          </select>
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
