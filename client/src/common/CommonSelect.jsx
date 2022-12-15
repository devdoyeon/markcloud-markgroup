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
      default:
        return selectVal;
    }
  };

  return (
    <div className={`selectBox ${select}`}>
      <div
        className={`selectVal`}
        onClick={() => (select === 'on' ? setSelect('off') : setSelect('on'))}>
        {changeSelectVal()}
        <img src={selectArrow} alt='선택 아이콘' />
      </div>
      {select === 'on' && (
        <div className='selectOptGroup'>
          {opt.reduce((acc, option) => {
            return (
              <>
                {acc}
                <div
                  className={`selectOpt ${selectVal === option && 'active'}`}
                  onClick={() => {
                    setSelectVal(option);
                    setSelect('off');
                  }}>
                  {option}
                </div>
              </>
            );
          }, <></>)}
        </div>
      )}
    </div>
  );
};

export default CommonSelect;
