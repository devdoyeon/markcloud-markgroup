import 'App.css';
import { Routes, Route } from 'react-router-dom';
// =============== Pages ===============
import Home from 'pages/Home';
import Board from 'pages/Board';
import WeeklyReport from 'pages/WeeklyReport';
import Notice from 'pages/Notice';
import ProjectStatus from 'pages/Project/ProjectStatus';
import PersonnelManagement from 'pages/PersonnelManagement';
import BusinessManagement from 'pages/Business/BusinessManagement';
// =============== CommonPages ===============
import NewBoard from 'pages/common/NewBoard';
import BoardRead from 'pages/common/BoardRead';
import ProjectDetail from 'pages/Project/ProjectDetail';
import NewProject from 'pages/Project/NewProject';
import BusinessNewBoard from 'pages/Business/BusinessNewBoard';
import NotFound from 'pages/common/NotFound';
import BusinessBoardRead from 'pages/Business/BusinessBoardRead';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/project' element={<ProjectStatus />} />
        <Route path='/weekly' element={<WeeklyReport />} />
        <Route path='/board' element={<Board />} />
        <Route path='/sample' element={<BoardRead />} />
        <Route path='/business' element={<BusinessManagement />} />
        <Route path='/personnel' element={<PersonnelManagement />} />
        <Route path='/notice' element={<Notice />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 상세 보기 Route */}
        <Route path='/project/:id' element={<ProjectDetail />} />
        <Route path='/weekly/:id' element={<BoardRead />} />
        <Route path='/board/:id' element={<BoardRead />} />
        <Route path='/notice/:id' element={<BoardRead />} />
        <Route path='/business/:id' element={<BusinessBoardRead />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 작성, 프로젝트 현황 작성 Route */}
        <Route path='/project/write' element={<NewProject />} />
        <Route path='/weekly/write' element={<NewBoard />} />
        <Route path='/board/write' element={<NewBoard />} />
        <Route path='/notice/write' element={<NewBoard />} />
        <Route path='/business/write' element={<BusinessNewBoard />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 수정, 프로젝트 현황 수정 Route */}
        <Route path='/project/write/:id' element={<NewProject />} />
        <Route path='/weekly/write/:id' element={<NewBoard />} />
        <Route path='/board/write/:id' element={<NewBoard />} />
        <Route path='/notice/write/:id' element={<NewBoard />} />
        <Route path='/business/write/:id' element={<BusinessNewBoard />} />
        {/* -------------------------------------------------- */}
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
