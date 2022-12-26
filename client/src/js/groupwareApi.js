import axios from 'axios';
import { getCookie, removeCookie, setCookie } from './cookie';

const header = () => ({
  headers: {
    'Content-Type': 'application/json',
    'access-token': getCookie('myToken'),
  },
});

//# API 통신 중 발생하는 에러 핸들링 함수
export const apiErrorHandling = async error => {
  const { status } = error?.response;
  const { detail } = error?.response?.data;
  switch (status) {
    case 401:
      if (detail === 'Access Denied') return 'accessDenied';
      break;
    case 403:
      if (detail === 'AccessTokenExpired') return await tokenReissue();
      else if (detail === 'LoginRequired') return 'tokenExpired';
      else if (detail === 'DuplicateLoginDetection') return 'duplicateLogin';
      else if (detail === 'Invaild User ID') return 'wrongId';
      else if (detail.includes(`Invaild Password`)) return `wrongPw`;
      else if (detail === 'Logins Exceeded') return 'loginExceeded';
      else if (detail === 'Payment Required') return 'paymentRequired';
      else if (detail === 'Service Expired, please contact to your manager')
        return 'serviceExpired';
      break;
    case 404:
      return 'notFound';
    case 422:
      switch (detail) {
        case 'InvalidClient':
          return 'NotAuthority';
        default:
          return '';
      }
    case 500:
    case 501:
    case 504:
      return 'serverError';
    default:
      return '';
  }
};

//# 아이피

const getIp = async () => {
  try {
    const ip = await axios.get('https://api.ip.pe.kr/');
    return ip?.data;
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//# 토큰 재발급
const tokenReissue = async () => {
  const headers = {
    'Content-Type': 'application/json',
    'access-token': getCookie('myToken'),
    'refresh-token': getCookie('rfToken'),
  };
  try {
    const result = await axios.get(`/api/users/self/token`, { headers });
    removeCookie('myToken');
    setCookie('myToken', result?.data?.data?.access_token, {
      path: '/',
    });
    window.location.reload();
  } catch (error) {
    return await apiErrorHandling(error);
  }
};

//# 로그인
export const signIn = async (userId, userPw) => {
  try {
    return await axios.post('/api/auth/login', {
      user_id: userId,
      password: userPw,
      login_ip: await getIp(),
    });
  } catch (error) {
    return await apiErrorHandling(error);
  }
};

//# 유저 정보
export const checkUserInfo = async () => {
  try {
    return await axios.get(
      `/api/users/self?current_ip=${await getIp()}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//# 인사관리 중복 아이디 체크
export const duplicateIdCheck = async userId => {
  const param = { user_id: userId.trim() };
  try {
    return await axios.post(`/api/auth/check/id-duplicate`, param, header());
  } catch (error) {
    return await apiErrorHandling(error);
  }
};

//# 결제 관련 데이터 생성 api
export const createMID = async data => {
  try {
    return await axios.post(
      `/api/order/create?current_ip=${await getIp()}`,
      data,
      header()
    );
  } catch (error) {
    return await apiErrorHandling(error);
  }
};
//# 결제 위변조 체크 api
export const checkPay = async data => {
  try {
    return await axios.post(
      `/api/order/verify?current_ip=${await getIp()}`,
      data,
      header()
    );
  } catch (error) {
    return await apiErrorHandling(error);
  }
};

//# 체크포인트
export const checkPoint = async () => {
  try {
    return await axios.get(
      `/api/checkpoint/groupware?current_ip=${await getIp()}`,
      header()
    );
  } catch (error) {
    return await apiErrorHandling(error);
  }
};

// ==============================공지사항==============================
export const getNoticeList = async ({ page, limit = 9 }, type, value) => {
  try {
    if (type === '' || value === '') {
      return await axios.get(
        `/bw/notice/list?page=${page}&limit=${limit}`,
        header()
      );
    } else {
      return await axios.get(
        `/bw/notice/list?page=${page}&limit=${limit}&filter_type=${type}&filter_val=${value}`,
        header()
      );
    }
  } catch (error) {
    return apiErrorHandling(error);
  }
};
export const getNoticeInfo = async id => {
  try {
    return await axios.get(`/bw/notice/info?notice_id=${id}`, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const createNotice = async ({ title, content, created_id }) => {
  try {
    return await axios.post(
      `/bw/notice/create`,
      {
        title: title,
        content: content,
        created_id: created_id,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const editNotice = async ({ title, content, created_id }, id) => {
  try {
    return await axios.post(
      `/bw/notice/update?notice_id=${id}`,
      {
        title: title,
        content: content,
        created_id: created_id,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const deleteNotice = async id => {
  try {
    return await axios.post(
      `/bw/notice/delete?notice_id=${id}`,
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};
// ================================ 업무 관리 ================================

export const getBusinessRead = async (
  { project_name, status_filter },
  { page, limit }
) => {
  try {
    if (project_name === '' || project_name === '선택') {
      return await axios.get(
        `/bw/projects/read?limit=${limit}&page=${page}&status_filter=${status_filter}`,
        header()
      );
    } else {
      return await axios.get(
        `/bw/projects/read?limit=${limit}&page=${page}&project_name=${project_name}&status_filter=${status_filter}`,
        header()
      );
    }
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getBusinessFilterRead = async (
  { page, limit },
  {
    project_name,
    manager_id,
    request_id,
    title,
    content,
    progress_status,
    status_filter,
  }
) => {
  try {
    return await axios.post(
      `/bw/projects/filter_read?limit=${limit}&page=${page}&status_filter=${status_filter}`,
      {
        project_name,
        manager_id,
        request_id,
        title,
        content,
        progress_status,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getBusinessInfo = async id => {
  try {
    return await axios.get(`/bw/projects/info?project_id=${id}`, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const createBusiness = async ({
  project_name,
  title,
  content,
  work_status,
  request_id,
  manager_id,
}) => {
  try {
    return await axios.post(
      `/bw/projects/create`,
      {
        project_name: project_name,
        title: title,
        content: content,
        work_status: work_status,
        request_id: request_id,
        manager_id: manager_id,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const updateBusiness = async (
  { request_id, manager_id, work_status, title, content },
  id
) => {
  try {
    return await axios.post(`/bw/projects/update?project_id=${id}`, {
      request_id,
      manager_id,
      work_status,
      title,
      content,
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ================================인사 관리 ================================
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~department~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getDepartmentList = async ({ page, limit }) => {
  try {
    return await axios.get(
      `/bw/personnel/department/list?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentInfo = async id => {
  try {
    return await axios.get(
      `/bw/personnel/department/info?department_id=${id}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentCreate = async name => {
  try {
    return await axios.post(
      `/bw/personnel/department/create`,
      {
        department_name: name,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentUpdate = async ({ id, section }) => {
  try {
    return await axios.post(
      `/bw/personnel/department/update?department_id=${id}`,
      {
        department_name: section,
      }
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentDelete = async id => {
  try {
    return await axios.post(
      `/bw/personnel/department/delete?department_id=${id}`
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~member~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getMemberList = async ({ page, limit }) => {
  try {
    return await axios.get(
      `/bw/personnel/member/list?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberInfo = async id => {
  try {
    return await axios.get(
      `/bw/personnel/member/info?member_id=${id}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberCreate = async ({
  name,
  user_id,
  password,
  email,
  birthday,
  phone,
  gender,
  zip_code,
  address,
  section,
}) => {
  try {
    return await axios.post(
      `/bw/personnel/member/create`,
      {
        name,
        user_id,
        password,
        email,
        birthday,
        phone,
        gender,
        zip_code,
        address,
        section,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberUpdate = async ({
  id,
  user_id,
  name,
  gender,
  birthday,
  section,
  phone,
  email,
  address,
  zip_code,
}) => {
  try {
    return await axios.post(`/bw/personnel/member/update?member_id=${id}`, {
      id,
      user_id,
      name,
      gender,
      birthday,
      section,
      phone,
      email,
      address,
      zip_code,
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberDelete = async id => {
  try {
    return await axios.post(`/bw/personnel/member/delete?member_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ================================ 게시판 ================================

//& 게시판 리스트 불러오기
export const getBoardList = async ({ page, limit = 9 }, type, value) => {
  try {
    return await axios.get(
      `/groupware/board/list?page=${page}&limit=${limit}&filter_type=${
        value?.length ? type : 'all'
      }${value?.length ? `&filter_val=${value}` : ''}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시판 상세내역 불러오기
export const getBoardDetail = async id => {
  try {
    return await axios.get(
      `/groupware/board/detail?post_id=${id}`,
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 작성
export const createBoard = async ({ title, content }) => {
  try {
    return await axios.post(
      `/groupware/board/create`,
      {
        title: title,
        content: content,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 수정
export const editBoard = async ({ title, content }, id) => {
  try {
    return await axios.post(
      `/groupware/board/update?post_id=${id}`,
      {
        title: title,
        content: content,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 삭제
export const deleteBoard = async id => {
  try {
    return await axios.post(
      `/groupware/board/delete?post_id=${id}`,
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ================================ 주간 업무 보고 ================================

//& 주간 업무 보고 불러오기
export const getReportList = async ({ page, limit = 9 }, type, value) => {
  try {
    return await axios.get(
      `/groupware/report/list?page=${page}&limit=${limit}&filter_type=${
        value?.length ? type : 'all'
      }${value?.length ? `&filter_val=${value}` : ''}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 상세내역 불러오기
export const getReportDetail = async id => {
  try {
    return await axios.get(
      `/groupware/report/detail?report_id=${id}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 등록
export const createReport = async ({ title, content }) => {
  try {
    return await axios.post(
      `/groupware/report/create`,
      {
        title: title,
        content: content,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 수정
export const editReport = async ({ title, content }, id) => {
  try {
    return await axios.post(
      `/groupware/report/update?report_id=${id}`,
      {
        title: title,
        content: content,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 삭제
export const deleteReport = async id => {
  try {
    return await axios.post(
      `/groupware/report/delete?report_id=${id}`,
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ================================ 프로젝트 현황 ================================

//& 프로젝트 현황 불러오기
export const getProjectList = async (
  page,
  limit,
  { name, start_date, end_date },
  status
) => {
  try {
    return await axios.get(
      `/groupware/project/list?page=${page}&limit=${limit}${
        name?.length ? `&project_name=${name}` : ''
      }${status?.length ? `&project_status=${status}` : ''}${
        start_date?.length ? `&start_date=${start_date}` : ''
      }${end_date?.length ? `&end_date=${end_date}` : ''}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 상세 보기
export const getProjectDetail = async id => {
  try {
    return await axios.get(
      `/groupware/project/detail?project_id=${id}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 생성
export const createProject = async projectInfo => {
  try {
    return await axios.post(`/groupware/project/create`, projectInfo, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 수정
export const editProject = async (id, projectInfo) => {
  try {
    return await axios.post(
      `/groupware/project/update?project_id=${id}`,
      projectInfo,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 삭제
export const deleteProject = async id => {
  try {
    return await axios.post(
      `/groupware/project/delete?project_id=${id}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트에 추가 가능한 인원 불러오기
export const getPeopleList = async () => {
  try {
    return await axios.get(`/groupware/project/member`, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 인원 추가
export const addProjectMember = async (id, memberId) => {
  try {
    return await axios.post(
      `/groupware/project/member_add?project_id=${id}`,
      { new_member_id: memberId },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 인원 제거
export const deleteProjectMember = async (id, memberId) => {
  try {
    return await axios.post(
      `/groupware/project/member_delete?project_id=${id}`,
      { delete_member_id: memberId },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};
