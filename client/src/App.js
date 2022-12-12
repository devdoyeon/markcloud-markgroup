import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectStatus from './pages/ProjectStatus';
import WeeklyReport from './pages/WeeklyReport';
import Board from './pages/Board';
import BusinessManagement from './pages/BusinessManagement';
import PersonnelManagement from './pages/PersonnelManagement';
import Notice from './pages/Notice';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/project' element={<ProjectStatus />} />
        <Route path='/weekly' element={<WeeklyReport />} />
        <Route path='/board' element={<Board />} />
        {/* <Route path='/board/:id' element={<BoardRead />} /> */}
        <Route path='/business' element={<BusinessManagement />} />
        <Route path='/personnel' element={<PersonnelManagement />} />
        <Route path='/notice' element={<Notice />} />
        {/* <Route path='/notice/:id' element={<BoardRead />} /> */}
      </Routes>
    </div>
  );
}

export default App;
