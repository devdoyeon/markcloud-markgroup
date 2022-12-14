import { useState } from 'react';
import selectArrow from 'image/selectArrow.svg';

const CommonSelect = ({ opt, selectVal, setSelectVal }) => {
  const [statusSelect, setStatusSelect] = useState('off');

  return (
    <div className={`selectBox ${statusSelect}`}>
      <div
        className={`selectVal`}
        onClick={() =>
          statusSelect === 'on' ? setStatusSelect('off') : setStatusSelect('on')
        }>
        {selectVal}
        <img src={selectArrow} alt='선택 아이콘' />
      </div>
      {statusSelect === 'on' && (
        <div className='selectOptGroup'>
          {opt.reduce((acc, option) => {
            return (
              <>
                {acc}
                <div
                  className={`selectOpt ${selectVal === option && 'active'}`}
                  onClick={() => {
                    setSelectVal(option);
                    setStatusSelect('off');
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
