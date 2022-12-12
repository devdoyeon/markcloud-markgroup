import SideMenu from 'common/SideMenu';
import noneImg from 'image/noneList.svg';

const WeeklyReport = () => {
  return (
    <div className='container'>
      <SideMenu />
    <div className='content-wrap notice'>
      <div className='header'>
        <h3>주간 업무 보고</h3>
      </div>
      <div className='list-wrap'>
        <div className='noneList column'>
          <img src={noneImg} alt='글 없음 아이콘' />
          <span>등록된 게시글이 없습니다.</span>
        </div>
        <div className='btn-wrap'>
          <button className='commonBtn noticeBtn'>등록</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default WeeklyReport;
