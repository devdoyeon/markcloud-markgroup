import { useEffect, useState } from 'react';
import selectArrow from 'image/selectArrow.svg';

const BusinessCommonSelect = ({
  opt,
  selectVal,
  setSelectVal,
  postInfo,
  pathname,
  filter,
  person,
  nameKey,
  setMemberCurKey,
  admin,
  projectValue,
}) => {
  const [select, setSelect] = useState('off');

  /*
    ! props
    & opt => type(Array) => 선택 옵션
    = useState[selectVal, setSelectVal] => type(String) => 선택된 값
  */

  useEffect(() => {
    if (pathname === 'business') {
      setSelect('off');
    }
  }, [postInfo.status_filter]);

  return (
    <div className={`selectBox ${select}`}>
      <div
        className={`selectVal`}
        onClick={() => {
          if (pathname === 'business') {
            if (person === 'person') {
              if (filter === 'MyProject') {
                return setSelect('off');
              }
            } else if (person === 'request') {
              if (filter === 'MyRequest') {
                return setSelect('off');
              }
            }
          }
          if (admin === 'admin') {
            return setSelect('off');
          }
          if (projectValue === '선택') {
            return setSelect('off');
          }
          select === 'on' ? setSelect('off') : setSelect('on');
        }}>
        <span>{selectVal}</span>
        <img src={selectArrow} alt='선택 아이콘' />
      </div>
      {select === 'on' && (
        <div className='selectOptGroup'>
          {opt?.length > 0 ? (
            opt?.reduce((acc, option, idx) => {
              return (
                <>
                  {acc}
                  <div
                    className={`selectOpt ${selectVal === option && 'active'}`}
                    data-key={nameKey[idx]}
                    onClick={() => {
                      setSelectVal(option);
                      setSelect('off');
                      setMemberCurKey(nameKey[idx]);
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

export default BusinessCommonSelect;
