import { useState } from 'react';
import selectArrow from 'image/selectArrow.svg';

const CommonSelect = ({ opt, selectVal, setSelectVal }) => {
  const [select, setSelect] = useState('off');

  /*
    ! props
    & opt => type(Array) => 선택 옵션
    = useState[selectVal, setSelectVal] => type(String) => 선택된 값
  */
  const changeSelectVal = () => {
    switch (selectVal) {
      case 'created_id':
        return '작성자';
      case 'title':
        return '제목';
      case 'all':
        return '전체';
      case 'before':
        return '시작 전';
      case 'progress':
        return '진행 중';
      case 'complete':
        return '종료';
      case 'none':
        return '선택';
      case 'patent':
        return '특허';
      case 'design':
        return '디자인';
      case 'mark':
        return '상표';
      case 'application':
        return '출원';
      case 'decide':
        return '심사중';
      case 'opinionNotice':
        return '의견제출통지';
      case 'apply':
        return '등록';
      default:
        return selectVal;
    }
  };

  return (
    <div className={`selectBox ${select}`}>
      <div
        className={`selectVal`}
        onClick={() => {
          select === 'on' ? setSelect('off') : setSelect('on');
        }}>
        <span>{changeSelectVal()}</span>
        <img src={selectArrow} alt='선택 아이콘' />
      </div>
      {select === 'on' && (
        <div className='selectOptGroup'>
          {opt?.length > 0 ? (
            opt?.reduce((acc, option) => {
              return (
                <>
                  {acc}
                  <div
                    className={`selectOpt ${
                      selectVal === option ? 'active' : ''
                    }`}
                    onClick={() => {
                      setSelectVal(option);
                      setSelect('off');
                    }}>
                    {option}
                  </div>
                </>
              );
            }, <></>)
          ) : (
            <>
              <div className='selectOpt'>목록이 없습니다.</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommonSelect;
