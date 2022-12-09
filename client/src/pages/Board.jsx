import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';

const Board = () => {
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
        <div className='header'>
          <h3>자유게시판</h3>
        </div>
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
          {/* <Pagination
          postsPerPage={pageInfo.limit}
          viewPageNum={5}
          totalPosts={pageInfo.totalCount}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        /> */}
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
  );
};

export default Board;
