import { useEffect } from 'react';
import { commonModalSetting } from 'js/commonUtils';

const CommonModal = ({ setModal, modal, okFn }) => {
  useEffect(() => {
    if (modal.content === undefined || modal.content === 'undefined')
      setModal(false);
    document.querySelector('.alert-content').innerHTML =
      new DOMParser().parseFromString(
        modal.content,
        'text/html'
      ).body.innerHTML;
    // 줄바꿈 태그 <br/> 사용하기 위해서 String2DOM 변환
  }, []);

  return (
    <div className='alert-modal'>
      <div className='modal'>
        <div className='alertContent'>
          <div className='head'>알림</div>
          <div className='alert-content'></div>
        </div>
        <div className='btn-wrap'>
          <button
            onClick={() => {
              okFn();
              commonModalSetting(setModal, false);
            }}>
            확인
          </button>
          {modal.mode === 'confirm' && (
            <button
              onClick={() => {
                commonModalSetting(setModal, false);
              }}>
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
