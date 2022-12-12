import { useState } from 'react';
import SideMenu from '../common/SideMenu';
import { useLocation, useParams } from 'react-router-dom';
import EditorComponent from '../common/EditorComponent';

const NewBoard = () => {
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
        <div className='header'>
          <h3>
            header
            {/* {header} */}
          </h3>
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
            <div className='date'>
              <span>작성일</span>
              <div>
                info.created_at
                {/* {info.created_at} */}
              </div>
            </div>
            <div className='line'></div>
            <div className='content'>{/* <EditorComponent /> */}</div>
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
