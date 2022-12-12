import { useState } from 'react';
import selectArrow from 'image/selectArrow.svg';

const ProjectSelect = () => {
  const [select, setSelect] = useState('off');
  const [status, setStatus] = useState('');

  const returnStatus = () => {
    switch (status) {
      case '':
        return '선택';
      case 'notStarted':
        return '시작 전';
      case 'ing':
        return '진행 중';
      case 'end':
        return '종료';
      default:
        return;
    }
  };

  return (
    <div className='selectBox status'>
      <div className='selectVal' onClick={() => setSelect('on')}>
        {returnStatus()}
        <img src={selectArrow} alt='선택 아이콘' />
      </div>
      {select === 'on' && (
        <div className='selectOptGroup'>
          <div
            className={`selectOpt ${status === 'notStarted' && 'active'}`}
            onClick={() => {
              setStatus('notStarted');
              setSelect('off');
            }}>
            시작 전
          </div>
          <div
            className={`selectOpt ${status === 'ing' && 'active'}`}
            onClick={() => {
              setStatus('ing');
              setSelect('off');
            }}>
            진행 중
          </div>
          <div
            className={`selectOpt ${status === 'end' && 'active'}`}
            onClick={() => {
              setStatus('end');
              setSelect('off');
            }}>
            종료
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelect;
