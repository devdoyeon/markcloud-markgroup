import SideMenu from 'common/SideMenu';
import CommonHeader from 'common/CommonHeader';
import Pagination from 'common/Pagination';

const Board = () => {
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
        <CommonHeader header={'자유게시판'} />
        <div className='list-wrap'>
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
          </ul>
          <div className='btn-wrap'>
            <button className='commonBtn noticeBtn'>등록</button>
          </div>
        </div>
          {/* <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo}/> */}
      </div>
    </div>
  );
};

export default Board;
