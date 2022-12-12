import EditorComponent from 'common/EditorComponent';
import SideMenu from 'common/SideMenu';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const NewBoard = () => {
  const path = useLocation().pathname;
  const { id } = useParams();
  const split = path.split('/');
  let header = '';

  switch (split[1]) {
    case 'project':
      header = '프로젝트 현황';
      break;
    case 'weekly':
      header = '주간 업무 보고';
      break;
    case 'board':
      header = '사내 게시판';
      break;
    case 'notice':
      header = '공지사항';
      break;
    default:
      break;
  }
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
        <div className='header'>
          {/* <h3>{header}</h3> */}
          <h3>{header}</h3>
        </div>
        <div className='board-wrap'>
          <div className='body-wrap'>
            <div className='writer'>
              <span>작성자</span>
              <div>
                info.created_id
                {/* {info.created_id} */}
              </div>
            </div>
            <div className='title'>
              <span>제목</span>
              <div>
                <input
                  type='text'
                  placeholder='제목을 입력해주세요.'
                  className='title-input'
                />
              </div>
            </div>
            <div className='line'></div>
            <div className='content'>
              <EditorComponent />
            </div>
          </div>
        </div>
        <div className='btn-wrap'>
          <button className='commonBtn'>수정</button>
          <button className='commonBtn list'>목록</button>
        </div>
      </div>
    </div>
  );
};

export default NewBoard;
