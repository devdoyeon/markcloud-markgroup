import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { enterFn } from 'js/commonUtils';
import searchIcon from 'image/searchIcon.svg';
import CommonSelect from './CommonSelect';

// 자주 쓰이는 헤더
const CommonHeader = ({
  filter,
  setFilter,
  setSearchText,
  searchText,
  okFn,
}) => {
  const path = useLocation().pathname;
  const searchOptionArr = ['작성자', '제목'];

  const returnHeader = () => {
    switch (path.split('/')[2]) {
      case 'board':
        return '게시판';
      case 'notice':
        return '공지사항';
      case 'report':
        return '주간 업무 보고';
      case 'project':
        return '프로젝트 현황';
      case 'manage-mark':
        return '지식재산 관리'
      default:
        return '';
    }
  };

  useEffect(() => {
    let kor = filter;
    switch (kor) {
      case '제목':
        setFilter('title');
        break;
      case '작성자':
        setFilter('created_id');
        break;
      default:
        return;
    }
  }, [filter]);

  return (
    <>
      <div className='header' onClick={() => window.location.reload()}>
        <h3>{returnHeader()}</h3>
      </div>
      <div className='search-wrap'>
        <div className='search'>
          <CommonSelect
            opt={searchOptionArr}
            selectVal={filter}
            setSelectVal={setFilter}
          />
          <input
            type='text'
            placeholder='검색어를 입력해 주세요.'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={e => enterFn(e, okFn)}
          />
          <button onClick={okFn}>
            <img src={searchIcon} alt='검색 아이콘' />
          </button>
        </div>
      </div>
    </>
  );
};

export default CommonHeader;
