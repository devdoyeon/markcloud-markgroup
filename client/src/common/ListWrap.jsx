import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import noneImg from 'image/noneList.svg';

const ListWrap = ({ list }) => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const renderList = () => {
    return list?.reduce((acc, { created_at, title, created_id, id }) => {
      const today = new Date();
      return (
        <>
          {acc}
          <li onClick={() => navigate(`/${path.split('/')[1]}/${id}`)}>
            <div className='row postInfo'>
              <span className='date'>{created_at.replaceAll('-', '.')}</span>
              {`${today.getFullYear()}-${
                today.getMonth() + 1
              }-${today.getDate()}` === created_at ? (
                <span className='alertNew'>NEW</span>
              ) : (
                <></>
              )}
            </div>
            <div className='postTitle'>{title}</div>
            <hr />
            <div className='postWriter'>{created_id}</div>
          </li>
        </>
      );
    }, <></>);
  };

  return (
    <div className='list-wrap'>
      {list?.length ? (
        <>
          <ul>{renderList()}</ul>
        </>
      ) : (
        <div className='noneList column'>
          <img src={noneImg} alt='글 없음 아이콘' />
          <span>등록된 게시글이 없습니다.</span>
        </div>
      )}
      <div className='btn-wrap'>
        <button
          className='commonBtn applyBtn'
          onClick={() => navigate(`${path}/write`)}>
          등록
        </button>
      </div>
    </div>
  );
};

export default ListWrap;
