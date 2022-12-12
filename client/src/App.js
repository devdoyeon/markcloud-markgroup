import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectStatus from './pages/ProjectStatus';
import WeeklyReport from './pages/WeeklyReport';
import Board from './pages/Board';
import BusinessManagement from './pages/BusinessManagement';
import PersonnelManagement from './pages/PersonnelManagement';
import Notice from './pages/Notice';
import BoardRead from 'pages/BoardRead';

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
      </Routes>
      {/* 
        /weekly/:id
        /notice/:id
        /board/:id
        => 주간업무보고, 공지사항, 게시판 상세 보기 Route

        --------------------------------------------------

        /weekly/write
        /notice/write
        /board/write
        => 주간업무보고, 공지사항, 게시판 작성 Route

        --------------------------------------------------

        /weekly/write/:id
        /notice/write/:id
        /board/write/:id
        => 주간업무보고, 공지사항, 게시판 수정 Route
        
      */}
    </div>
  );
}

export default App;
