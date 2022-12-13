import { useState, useEffect } from 'react';
import SideMenu from 'common/SideMenu';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getBoardDetail } from 'js/groupwareApi';

const BoardRead = () => {
  const path = useLocation().pathname;
  let prevent = false;
  const navigate = useNavigate();
  const { id } = useParams();
  const [header, setHeader] = useState('');
  const [info, setInfo] = useState({});

  const getDetail = async () => {
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
      setHeader('사내게시판');
      result = await getBoardDetail(id);
    }
    if (typeof result === 'object') {
      setInfo(result?.data);
      document.querySelector('.content').innerHTML =
        new DOMParser().parseFromString(
          result?.data?.content,
          'text/html'
        ).body.innerHTML;
    } else {
      //에러핸들링
      return;
    }
  };

  useEffect(() => {
    getDetail();
  }, [id]);

  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
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
              <div>{info?.created_at?.replace('T', ' ')}</div>
            </div>
            <div className='line'></div>
            <div className='content'></div>
          </div>
        </div>
        <div className='btn-wrap'>
          <button
            className='commonBtn'
            onClick={() => navigate(`/${path.split('/')[1]}/write/${id}`)}>
            수정
          </button>
          <button className='commonBtn list' onClick={() => navigate(-1)}>
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardRead;
