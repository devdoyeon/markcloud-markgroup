import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const BoardRead = () => {
  const path = useLocation().pathname;
  const { id } = useParams();
  let prevent = false;
  const [header, setHeader] = useState('');
  const [info, setInfo] = useState({
    title: '',
    created_id: '',
    created_at: '',
    content: '',
    updated_at: '',
  });

  const sample = async () => {
    if (prevent) return;
    prevent = false;
    setTimeout(() => {
      prevent = true;
    }, 200);
    let result;
    if (path.includes('/notice')) {
      setHeader('공지 사항');
      // result = getNoticeDetail(id);
    } else if (path.includes('/weekly')) {
      setHeader('주간 업무 보고');
      // result = getWeeklyDetail(id);
    } else if (path.includes('/board')) {
      setHeader('자유 게시판');
      // result = getBoardDetail(id);
    }
    if (typeof result === 'object') {
      setInfo(result?.data?.data);
    } else {
      //에러핸들링
      return;
    }
  };

  return (
    <>
      <div className='header'>
        <h3>{header}</h3>
      </div>
      <div className='board-wrap'>
        <div className='header'>
          <h4>{info.title}</h4>
        </div>
        <div className='body-wrap'>
          <div className='writer'>
            <span>작성자</span>
            <div>{info.created_id}</div>
          </div>
          <div className='date'>
            <span>작성일</span>
            <div>{info.created_at}</div>
          </div>
          <div className='line'></div>
          <div className='content'>{info.content}</div>
        </div>
      </div>
      <div className='btn-wrap'>
        <button className='commonBtn'>수정</button>
        <button className='commonBtn list'>목록</button>
      </div>
    </>
  );
};

export default BoardRead;
