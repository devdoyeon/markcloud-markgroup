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
import NewBoard from 'pages/NewBoard';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/project' element={<ProjectStatus />} />
        <Route path='/weekly' element={<WeeklyReport />} />
        <Route path='/board' element={<Board />} />
        <Route path='/business' element={<BusinessManagement />} />
        <Route path='/personnel' element={<PersonnelManagement />} />
        <Route path='/notice' element={<Notice />} />
        {/* => 주간업무보고, 공지사항, 게시판 상세 보기, 프로젝트 현황 Route */}
        <Route path='/project/:id' element={<BoardRead />} />
        <Route path='/weekly/:id' element={<BoardRead />} />
        <Route path='/board/:id' element={<BoardRead />} />
        <Route path='/notice/:id' element={<Board />} />
        {/* => 주간업무보고, 공지사항, 게시판 작성, 프로젝트 현황 Route */}
        <Route path='/project/write' element={<NewBoard />} />
        <Route path='/weekly/write' element={<NewBoard />} />
        <Route path='/board/write' element={<NewBoard />} />
        <Route path='/notice/write' element={<NewBoard />} />
        {/* => 주간업무보고, 공지사항, 게시판 수정, 프로젝트 현황 Route */}
        <Route path='/project/write/:id' element={<ProjectStatus />} />
        <Route path='/weekly/write/:id' element={<WeeklyReport />} />
        <Route path='/board/write/:id' element={<Board />} />
        <Route path='/notice/write/:id' element={<Board />} />
        <Route path='/sample' element={<BoardRead />} />
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
