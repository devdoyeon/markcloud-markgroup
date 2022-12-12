import React from 'react';
import noneImg from 'image/noneList.svg';

const ListWrap = ({ list }) => {
  // const renderList = () => {
    // return list?.reduce((acc, { created_at, title, created_id}) => {
    //   return (
    //     <>
    //       {acc}
    //       <li>
    //         <div className='row postInfo'>
    //           <span className='date'>{created_at}</span>
    //           <span className='alertNew'>NEW</span>
    //         </div>
    //         <div className='postTitle'>{title}</div>
    //         <hr />
    //         <div className='postWriter'>{created_id}</div>
    //       </li>
    //     </>
    //   );
    // }, <></>);
  // };

  return (
    <div className='list-wrap'>
      {list?.length ? (
        <>
          <div className='noneList column'>
            <img src={noneImg} alt='글 없음 아이콘' />
            <span>등록된 게시글이 없습니다.</span>
          </div>
        </>
      ) : (
        <ul>
          {new Array(9).fill('').map(
            (i, idx) => (
              <>
                <li className={idx}>
                  <div className='row postInfo'>
                    <span className='date'>2022.10.{20 + idx}</span>
                    <span className='alertNew'>NEW</span>
                  </div>
                  <div className='postTitle'>제목제목제목제목제목 {idx}</div>
                  <hr />
                  <div className='postWriter'>작성자명</div>
                </li>
              </>
            ),
            <></>
          )}
          {/* {renderList()} */}
        </ul>
      )}
      <div className='btn-wrap'>
        <button className='commonBtn noticeBtn'>등록</button>
      </div>
    </div>
  );
};

export default ListWrap;
