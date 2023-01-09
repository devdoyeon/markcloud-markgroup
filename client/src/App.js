import 'App.css';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  Redirect,
  useLocation,
  useNavigate,
} from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    //아임포트 IMP 객체 초기화
    let IMP = window.IMP;
    IMP.init('imp99495830');
  }, []);

  useEffect(() => {
    if (pathname === '/') navigate('/mark-groupware');
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className='App'>
      <Routes>
        <Route exact path='/mark-groupware' element={<Home />} />
        <Route exact path='/mark-groupware/sign-in' element={<SignIn />} />
        <Route exact path='/mark-groupware/cost' element={<Cost />} />
        <Route exact path='/mark-groupware/payment' element={<Payment />} />
        <Route
          exact
          path='/mark-groupware/payment-success'
          element={<PaymentSuccess />}
        />
        <Route
          exact
          path='/mark-groupware/project'
          element={<ProjectStatus />}
        />
        <Route exact path='/mark-groupware/report' element={<Report />} />
        <Route exact path='/mark-groupware/board' element={<Board />} />
        <Route
          exact
          path='/mark-groupware/business'
          element={<BusinessManagement />}
        />
        <Route
          exact
          path='/mark-groupware/personnel'
          element={<PersonnelManagement />}
        />
        <Route exact path='/mark-groupware/notice' element={<Notice />} />
        {/* => 주간 업무 보고, 공지사항, 게시판 상세 보기 Route */}
        <Route
          exact
          path='/mark-groupware/project/:id'
          element={<ProjectDetail />}
        />
        <Route
          exact
          path='/mark-groupware/report/:id'
          element={<BoardRead />}
        />
        <Route exact path='/mark-groupware/board/:id' element={<BoardRead />} />
        <Route
          exact
          path='/mark-groupware/notice/:id'
          element={<BoardRead />}
        />
        <Route
          exact
          path='/mark-groupware/business/:id'
          element={<BusinessBoardRead />}
        />
        {/* => 주간 업무 보고, 공지사항, 게시판 작성, 프로젝트 현황 작성 Route */}
        <Route
          exact
          path='/mark-groupware/project/write'
          element={<NewProject />}
        />
        <Route
          exact
          path='/mark-groupware/report/write'
          element={<NewBoard />}
        />
        <Route
          exact
          path='/mark-groupware/board/write'
          element={<NewBoard />}
        />
        <Route
          exact
          path='/mark-groupware/notice/write'
          element={<NewBoard />}
        />
        <Route
          exact
          path='/mark-groupware/business/write'
          element={<BusinessNewBoard />}
        />
        <Route
          exact
          path='/mark-groupware/personnel/write'
          element={<PersonnelMember />}
        />
        {/* => 주간 업무 보고, 공지사항, 게시판 수정, 프로젝트 현황 수정 Route */}
        <Route
          exact
          path='/mark-groupware/project/write/:id'
          element={<NewProject />}
        />
        <Route
          exact
          path='/mark-groupware/report/write/:id'
          element={<NewBoard />}
        />
        <Route
          exact
          path='/mark-groupware/board/write/:id'
          element={<NewBoard />}
        />
        <Route
          exact
          path='/mark-groupware/notice/write/:id'
          element={<NewBoard />}
        />
        <Route
          exact
          path='/mark-groupware/business/write/:id'
          element={<BusinessEditBoard />}
        />
        <Route
          exact
          path='/mark-groupware/personnel/write/:id'
          element={<PersonnelMember />}
        />
        {/* -------------------------------------------------- */}
        <Route path='/mark-groupware/*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
