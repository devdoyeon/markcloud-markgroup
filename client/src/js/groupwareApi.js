import axios from 'axios';
import { getCookie, removeCookie, setCookie } from './cookie';

//# API 통신 중 발생하는 에러 핸들링 함수
const apiErrorHandling = async error => {
  const { status } = error?.response;
  const { detail } = error?.response?.data;
  const failCount = detail?.split(',')[1];
  switch (status) {
    case 401:
      if (detail === 'Access Denied') return 'accessDenied';
      break;
    case 403:
      if (detail === 'AccessTokenExpired') return await tokenReissue();
      else if (detail === 'LoginRequired') return 'tokenExpired';
      else if (detail === 'DuplicateLoginDetection') return 'duplicateLogin';
      else if (detail === 'Invaild User ID') return 'wrongId';
      else if (detail === `Invaild Password,${failCount}`)
        return `wrongPw,${failCount}`;
      else if (detail === 'Logins Exceeded') return 'loginExceeded';
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
  const headers = {
    'access-token': getCookie('myToken'),
  };
  try {
    return await axios.get(`/api/users/self?current_ip=${await getIp()}`, {
      headers,
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};
//# 인사관리 중복 아이디 체크
export const duplicateIdCheck = async userId => {
  const header = { 'Content-Type': 'application/json' };
  try {
    const result = await axios.post(`/api/auth/check/id-duplicate`, {
      user_id: userId,
    });
  } catch (error) {
    return await apiErrorHandling(error);
  }
};

// ==============================공지사항==============================
export const getNoticeList = async ({ page, limit = 9 }, type, value) => {
  try {
    if (type === '' || value === '') {
      return await axios.get(`/bw/notice/list?page=${page}&limit=${limit}`);
    } else {
      return await axios.get(
        `/bw/notice/list?page=${page}&limit=${limit}&filter_type=${type}&filter_val=${value}`
      );
    }
  } catch (error) {
    return apiErrorHandling(error);
  }
};
export const getNoticeInfo = async id => {
  try {
    return await axios.get(`/bw/notice/info?notice_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const createNotice = async ({ title, content }) => {
  try {
    return await axios.post(`/bw/notice/create`, {
      title: title,
      content: content,
      created_id: 'songmoana',
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const editNotice = async ({ title, content, created_id }, id) => {
  try {
    return await axios.post(`/bw/notice/update?notice_id=${id}`, {
      title: title,
      content: content,
      created_id: 'songmoana',
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const deleteNotice = async id => {
  try {
    const typeChange = parseInt(id);
    return await axios.post(`/bw/notice/delete?notice_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};
// ================================ 업무 관리 ================================

export const getBusinessRead = async ({ page, limit }) => {
  try {
    return await axios.get(`/bw/projects/read?limit=${limit}&page=${page}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getBusinessFilterRead = async (
  { page, limit },
  status_filter,
  { project_name, manager_id, request_id, title, content, progress_status }
) => {
  try {
    return await axios.get(
      `/bw/projects/filter_read?limit=${limit}&page=${page}&status_filter=${status_filter}`,
      {
        project_name,
        manager_id,
        request_id,
        title,
        content,
        progress_status,
      }
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getBusinessInfo = async id => {
  try {
    return await axios.get(`/bw/projects/info?project_id=${id}`);
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
    return await axios.post(`/bw/projects/create`, {
      project_name,
      title,
      content,
      work_status,
      request_id,
      manager_id,
    });
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
export const getDepartmentList = async ({ page, limit }, cookie) => {
  const headers = {
    'access-token': cookie,
  };
  try {
    return await axios.get(
      `/bw/personnel/department/list?page=${page}&limit=${limit}`,
      { headers: headers }
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentInfo = async id => {
  try {
    return await axios.get(`/bw/personnel/department/info?department_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentCreate = async (name, cookie) => {
  const headers = {
    'access-token': cookie,
  };
  try {
    return await axios.post(
      `/bw/personnel/department/create`,
      {
        department_name: name,
      },
      { headers: headers }
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentUpdate = async ({ id, department_name }) => {
  try {
    return await axios.post(
      `/bw/personnel/department/update?department_id=${id}`,
      {
        department_name: department_name,
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
export const getMemberList = async ({ page, limit }, cookie) => {
  const headers = {
    'access-token': cookie,
  };
  try {
    return await axios.get(
      `/bw/personnel/member/list?page=${page}&limit=${limit}`,
      { headers: headers }
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberInfo = async id => {
  try {
    return await axios.get(`/bw/personnel/member/info?member_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberCreate = async (
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
  cookie
) => {
  const headers = {
    'access-token': cookie,
  };
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
      { headers: headers }
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberUpdate = async (
  {
    name,
    user_id,
    hashed_password,
    email,
    birthday,
    phone,
    gender,
    zip_code,
    address,
    section,
  },
  id
) => {
  try {
    return await axios.post(`/bw/personnel/member/update?member_id=${id}`, {
      name,
      user_id,
      hashed_password,
      email,
      birthday,
      phone,
      gender,
      zip_code,
      address,
      section,
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
      `/dy/board/list?page=${page}&limit=${limit}&filter_type=${
        value?.length ? type : 'all'
      }${value?.length ? `&filter_val=${value}` : ''}`
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시판 상세내역 불러오기
export const getBoardDetail = async id => {
  try {
    return await axios.get(`/dy/board/detail?post_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 작성
export const createBoard = async ({ title, content }) => {
  try {
    return await axios.post(`/dy/board/create`, {
      title: title,
      content: content,
      created_id: 'mxxvii',
      organ_code: 'markcloud',
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 수정
export const editBoard = async ({ title, content }, id) => {
  try {
    return await axios.post(`/dy/board/update?post_id=${id}`, {
      title: title,
      content: content,
      created_id: 'mxxvii',
      organ_code: 'markcloud',
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 삭제
export const deleteBoard = async id => {
  try {
    return await axios.post(`/dy/board/delete?post_id=${id}&user_id=mxxvii`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ================================ 주간 업무 보고 ================================

//& 주간 업무 보고 불러오기
export const getReportList = async ({ page, limit = 9 }, type, value) => {
  try {
    return await axios.get(
      `/dy/report/list?page=${page}&limit=${limit}&filter_type=${
        value?.length ? type : 'all'
      }${value?.length ? `&filter_val=${value}` : ''}`
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 상세내역 불러오기
export const getReportDetail = async id => {
  try {
    return await axios.get(`/dy/report/detail?report_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 등록
export const createReport = async ({ title, content }) => {
  try {
    return await axios.post(`/dy/report/create`, {
      title: title,
      content: content,
      created_id: 'mxxvii',
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 수정
export const editReport = async ({ title, content }, id) => {
  try {
    return await axios.post(
      `/dy/report/update?report_id=${id}&user_id=mxxvii`,
      {
        title: title,
        content: content,
      }
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 삭제
export const deleteReport = async id => {
  try {
    return await axios.post(`/dy/report/delete?report_id=${id}&user_id=d`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ================================ 프로젝트 현황 ================================

//& 프로젝트 현황 불러오기
export const getProjectList = async (name, status, start, end) => {
  try {
    return await axios.get(
      `/dy/project/list?project_name=${name}&project_status=${status}&start_date=${start}&end_date=${end}`
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};
