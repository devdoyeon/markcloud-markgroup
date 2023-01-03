import 'App.css';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import Payment from 'pages/Payment';
import PaymentSuccess from 'pages/PaymentSuccess';
import NewBoard from 'pages/common/NewBoard';
import BoardRead from 'pages/common/BoardRead';
import ProjectDetail from 'pages/Project/ProjectDetail';
import NewProject from 'pages/Project/NewProject';
import BusinessNewBoard from 'pages/Business/BusinessNewBoard';
import NotFound from 'pages/common/NotFound';
import BusinessBoardRead from 'pages/Business/BusinessBoardRead';
import PersonnelMember from 'pages/Personnel/PersonnelMember';
import BusinessEditBoard from 'pages/Business/BusinessEditBoard';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    //아임포트 IMP 객체 초기화
    let IMP = window.IMP;
    IMP.init('imp99495830');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className='App'>
      <Routes>
        <Route path='/gp' element={<Home />} />
        <Route path='/gp/sign-in' element={<SignIn />} />
        <Route path='/gp/cost' element={<Cost />} />
        <Route path='/gp/payment' element={<Payment />} />
        <Route path='/gp/payment-success' element={<PaymentSuccess />} />
        <Route path='/gp/project' element={<ProjectStatus />} />
        <Route path='/gp/report' element={<Report />} />
        <Route path='/gp/board' element={<Board />} />
        <Route path='/gp/business' element={<BusinessManagement />} />
        <Route path='/gp/personnel' element={<PersonnelManagement />} />
        <Route path='/gp/notice' element={<Notice />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 상세 보기 Route */}
        <Route path='/gp/project/:id' element={<ProjectDetail />} />
        <Route path='/gp/report/:id' element={<BoardRead />} />
        <Route path='/gp/board/:id' element={<BoardRead />} />
        <Route path='/gp/notice/:id' element={<BoardRead />} />
        <Route path='/gp/business/:id' element={<BusinessBoardRead />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 작성, 프로젝트 현황 작성 Route */}
        <Route path='/gp/project/write' element={<NewProject />} />
        <Route path='/gp/report/write' element={<NewBoard />} />
        <Route path='/gp/board/write' element={<NewBoard />} />
        <Route path='/gp/notice/write' element={<NewBoard />} />
        <Route path='/gp/business/write' element={<BusinessNewBoard />} />
        <Route path='/gp/personnel/write' element={<PersonnelMember />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 수정, 프로젝트 현황 수정 Route */}
        <Route path='/gp/project/write/:id' element={<NewProject />} />
        <Route path='/gp/report/write/:id' element={<NewBoard />} />
        <Route path='/gp/board/write/:id' element={<NewBoard />} />
        <Route path='/gp/notice/write/:id' element={<NewBoard />} />
        <Route path='/gp/business/write/:id' element={<BusinessEditBoard />} />
        <Route path='/gp/personnel/write/:id' element={<PersonnelMember />} />
        {/* -------------------------------------------------- */}
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
