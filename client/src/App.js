import 'App.css';
import { Routes, Route } from 'react-router-dom';
// =============== Pages ===============
import Home from 'pages/Home';
import SignIn from 'pages/SignIn';
import Board from 'pages/Board';
import Report from 'pages/Report';
import Notice from 'pages/Notice';
import ProjectStatus from 'pages/Project/ProjectStatus';
import PersonnelManagement from 'pages/Personnel/PersonnelManagement';
import BusinessManagement from 'pages/Business/BusinessManagement';
// =============== CommonPages ===============
import Cost from 'pages/Cost';
import NewBoard from 'pages/common/NewBoard';
import BoardRead from 'pages/common/BoardRead';
import ProjectDetail from 'pages/Project/ProjectDetail';
import NewProject from 'pages/Project/NewProject';
import BusinessNewBoard from 'pages/Business/BusinessNewBoard';
import NotFound from 'pages/common/NotFound';
import BusinessBoardRead from 'pages/Business/BusinessBoardRead';
import PersonnelMember from 'pages/Personnel/PersonnelMember';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/cost' element={<Cost />} />
        <Route path='/project' element={<ProjectStatus />} />
        <Route path='/report' element={<Report />} />
        <Route path='/board' element={<Board />} />
        <Route path='/business' element={<BusinessManagement />} />
        <Route path='/personnel' element={<PersonnelManagement />} />
        <Route path='/notice' element={<Notice />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 상세 보기 Route */}
        <Route path='/project/:id' element={<ProjectDetail />} />
        <Route path='/report/:id' element={<BoardRead />} />
        <Route path='/board/:id' element={<BoardRead />} />
        <Route path='/notice/:id' element={<BoardRead />} />
        <Route path='/business/:id' element={<BusinessBoardRead />} />
        <Route path='/personnel/:id' element={<PersonnelMember />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 작성, 프로젝트 현황 작성 Route */}
        <Route path='/project/write' element={<NewProject />} />
        <Route path='/report/write' element={<NewBoard />} />
        <Route path='/board/write' element={<NewBoard />} />
        <Route path='/notice/write' element={<NewBoard />} />
        <Route path='/business/write' element={<BusinessNewBoard />} />
        <Route path='/personnel/write' element={<PersonnelMember />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 수정, 프로젝트 현황 수정 Route */}
        <Route path='/project/write/:id' element={<NewProject />} />
        <Route path='/report/write/:id' element={<NewBoard />} />
        <Route path='/board/write/:id' element={<NewBoard />} />
        <Route path='/notice/write/:id' element={<NewBoard />} />
        <Route path='/business/write/:id' element={<BusinessNewBoard />} />
        <Route path='/personnel/write/:id' element={<PersonnelMember />} />
        {/* -------------------------------------------------- */}
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
