import axios from 'axios';
import { getCookie, removeCookie, setCookie } from './cookie';
import { replaceFn } from './commonUtils';

const header = () => ({
  headers: {
    'Content-Type': 'application/json',
    'access-token': getCookie('myToken'),
  },
});

const fileHeader = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
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
      else if (detail === 'Retired User') return 'retiredUser';
      else if (detail === 'LoginRequired') return 'tokenExpired';
      else if (detail === 'DuplicateLoginDetection') return 'duplicateLogin';
      else if (detail === 'Invaild User ID') return 'wrongId';
      else if (detail.includes(`Invaild Password`)) return `wrongPw`;
      else if (detail === 'Logins Exceeded') return 'loginExceeded';
      else if (detail === 'Payment Required') return 'paymentRequired';
      else if (detail.includes('Service Expired')) return 'serviceExpired';
      else if (detail === 'AlreadyProjectName') return 'alreadyProjectName';
      else if (detail === 'AlreadyUsedProject') return 'alreadyUsedProject';
      break;
    case 404:
      return 'notFound';
    case 409:
      if (detail.includes('Pending Order Exception')) return 'PaymentPending';
      break;
    case 422:
      if (detail === 'InvalidClient' || detail === 'notAdmin')
        return 'notAuthority';
      break;
    case 500:
    case 501:
    case 504:
      return 'serverError';
    default:
      return '';
  }
};

//# 아이피

export const getIp = async () => {
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
    removeCookie('myToken', {
      path: '/',
    });
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
        `/groupware/notice/list?page=${page}&limit=${limit}`,
        header()
      );
    } else {
      return await axios.get(
        `/groupware/notice/list?page=${page}&limit=${limit}&filter_type=${type}&filter_val=${value}`,
        header()
      );
    }
  } catch (error) {
    return apiErrorHandling(error);
  }
};
export const getNoticeInfo = async id => {
  try {
    return await axios.get(`/groupware/notice/info?notice_id=${id}`, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const createNotice = async (title, content, formData) => {
  try {
    return await axios.post(
      `/groupware/notice/create?title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn('post', content)}`,
      formData,
      formData ? fileHeader() : header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const editNotice = async (title, content, formData, id) => {
  try {
    return await axios.post(
      `/groupware/notice/update?notice_id=${id}&title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn('post', content)}`,
      formData,
      formData ? fileHeader() : header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const deleteNotice = async id => {
  try {
    return await axios.post(
      `/groupware/notice/delete?notice_id=${id}`,
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};
// ================================ 업무 관리 ================================
export const getBusinessRead = async (
  {
    project_name,
    manager_id,
    request_id,
    title,
    progress_status,
    content,
    status_filter,
  },
  { page, limit }
) => {
  try {
    if (project_name === '선택') {
      return await axios.post(
        `/groupware/projects/read?limit=${limit}&page=${page}&status_filter=${status_filter}`,
        {
          project_name: '',
          manager_id: manager_id === undefined ? '' : manager_id,
          request_id: request_id === undefined ? '' : request_id,
          title: title,
          content: content,
          progress_status:
            progress_status.length === 0
              ? ['요청', '접수', '진행', '완료']
              : progress_status,
        },
        header()
      );
    } else {
      return await axios.post(
        `/groupware/projects/read?limit=${limit}&page=${page}&status_filter=${status_filter}`,
        {
          project_name: project_name,
          manager_id: manager_id === undefined ? '' : manager_id,
          request_id: request_id === undefined ? '' : request_id,
          title: title,
          content: content,
          progress_status:
            progress_status.length === 0
              ? ['요청', '접수', '진행', '완료']
              : progress_status,
        },
        header()
      );
    }
  } catch (error) {
    return apiErrorHandling(error);
  }
};
export const getBusinessProjectRead = async (
  projectName,
  status_filter,
  { page, limit }
) => {
  try {
    return await axios.post(
      `/groupware/projects/read?limit=${limit}&page=${page}&status_filter=${status_filter}`,
      {
        project_name: projectName,
        manager_id: '',
        request_id: '',
        title: '',
        content: '',
        progress_status: ['요청', '접수', '진행', '완료'],
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getBusinessInfo = async id => {
  try {
    return await axios.get(
      `/groupware/projects/info?project_id=${id}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const createBusiness = async (
  { project_name, title, work_status, request_id, manager_id },
  content,
  formData
) => {
  try {
    return await axios.post(
      `/groupware/projects/create?project_name=${project_name}&title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn(
        'post',
        content
      )}&work_status=${work_status}&request_id=${request_id}&manager_id=${manager_id}`,
      formData,
      formData ? fileHeader() : header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const updateBusiness = async (
  { manager_id, work_status, title },
  content,
  formData,
  id
) => {
  try {
    return await axios.post(
      `/groupware/projects/update?project_id=${id}&manager_id=${
        manager_id === 'undefined' || manager_id === undefined ? '' : manager_id
      }&work_status=${work_status}&title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn('post', content)}`,
      formData,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const deleteBusiness = async id => {
  try {
    return await axios.post(
      `/groupware/projects/delete?project_id=${id}`,
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ================================인사 관리 ================================
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~department~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getDepartmentList = async ({ page, limit }, pageCon) => {
  try {
    if (pageCon === undefined || pageCon === 'undefined') {
      return await axios.get(
        `/groupware/personnel/department/list?page=${page}&limit=${limit}`,
        header()
      );
    } else {
      return await axios.get(
        `/groupware/personnel/department/list?page=${1}&limit=${limit}`,
        header()
      );
    }
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentInfo = async id => {
  try {
    return await axios.get(
      `/groupware/personnel/department/info?department_id=${id}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentCreate = async name => {
  try {
    return await axios.post(
      `/groupware/personnel/department/create`,
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
      `/groupware/personnel/department/update?department_id=${id}`,
      {
        department_name: section,
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentDelete = async id => {
  try {
    return await axios.post(
      `/groupware/personnel/department/delete?department_id=${id}`,
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~member~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getMemberList = async ({ page, limit }) => {
  try {
    return await axios.get(
      `/groupware/personnel/member/list?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberInfo = async id => {
  try {
    return await axios.get(
      `/groupware/personnel/member/info?member_id=${id}`,
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
      `/groupware/personnel/member/create`,
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
    return await axios.post(
      `/groupware/personnel/member/update?member_id=${id}`,
      {
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
      },
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getMemberDelete = async id => {
  try {
    return await axios.post(
      `/groupware/personnel/member/delete?member_id=${id}`,
      null,
      header()
    );
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
    return await axios.get(`/groupware/board/detail?post_id=${id}`, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 작성
export const createBoard = async (title, content, formData) => {
  try {
    return await axios.post(
      `/groupware/board/create?title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn('post', content)}`,
      formData,
      formData ? fileHeader() : header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 게시글 수정
export const editBoard = async (title, content, formData, id) => {
  try {
    return await axios.post(
      `/groupware/board/update?post_id=${id}&title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn('post', content)}`,
      formData,
      formData ? fileHeader() : header()
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
export const createReport = async (title, content, formData) => {
  try {
    return await axios.post(
      `/groupware/report/create?&title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn('post', content)}`,
      formData,
      formData ? fileHeader() : header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 주간 업무 보고 수정
export const editReport = async (title, content, formData, id) => {
  try {
    return await axios.post(
      `/groupware/report/update?report_id=${id}&title=${replaceFn(
        'post',
        title
      )}&content=${replaceFn('post', content)}`,
      formData,
      formData ? fileHeader() : header()
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
export const createProject = async (
  { project_name, project_start_date, project_end_date, project_status },
  project_description,
  formData
) => {
  try {
    return await axios.post(
      `/groupware/project/create?project_name=${replaceFn(
        'post',
        project_name
      )}&project_description=${replaceFn(
        'post',
        project_description
      )}&project_start_date=${project_start_date}&project_end_date=${project_end_date}&project_status=${project_status}`,
      formData,
      formData ? fileHeader() : header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 수정
export const editProject = async (
  { project_name, project_start_date, project_end_date, project_status },
  project_description,
  formData,
  id
) => {
  try {
    return await axios.post(
      `/groupware/project/update?project_id=${id}&project_name=${replaceFn(
        'post',
        project_name
      )}&project_description=${replaceFn(
        'post',
        project_description
      )}&project_start_date=${project_start_date}&project_end_date=${project_end_date}&project_status=${project_status}`,
      formData,
      formData ? fileHeader() : header()
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
      null,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 프로젝트 참가 인원 불러오기
export const getProjectMember = async id => {
  try {
    return await axios.get(
      `/groupware/project/project_members?project_id=${id}`,
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

// ================================ 지식재산권 관리 ================================

//& 지식재산권 목록 불러오기
export const getMarkList = async ({ page, limit }) => {
  try {
    return await axios.get(
      `/groupware/ip/list?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 지식재산 등록
export const makeMarkData = async query => {
  try {
    return await axios.post(`/groupware/ip/create`, query, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 지식재산 상세 보기
export const getMarkDetail = async id => {
  try {
    return await axios.get(`/groupware/ip/detail?ip_id=${id}`, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 지식재산 수정
export const editMark = async (id, query) => {
  try {
    return await axios.post(
      `/groupware/ip/update?ip_id=${id}`,
      query,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 지식재산 삭제
export const deleteMark = async id => {
  try {
    return await axios.post(`/groupware/ip/delete?ip_id=${id}`, null, header());
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//& 지식재산 검색
export const searchMark = async data => {
  const {
    rights,
    application_number,
    application_start_date,
    application_end_date,
    applicant,
    name_kor,
    product_code,
    registration_number,
    registration_start_date,
    registartion_end_date,
  } = data;

  try {
    return await axios.get(
      `/groupware/ip/list?rights=${rights}${
        application_number?.length
          ? `&application_number=${application_number}`
          : ''
      }${
        application_start_date?.length
          ? `&application_start_date=${application_start_date}`
          : ''
      }${
        application_end_date?.length
          ? `&application_end_date=${application_end_date}`
          : ''
      }${applicant?.length ? `&applicant=${applicant}` : ''}${
        name_kor?.length ? `&name_kor=${name_kor}` : ''
      }${product_code?.length ? `&product_code=${product_code}` : ''}${
        registration_number?.length
          ? `&registration_number=${registration_number}`
          : ''
      }${
        registration_start_date?.length
          ? `&registration_start_date=${registration_start_date}`
          : ''
      }${
        registartion_end_date?.length
          ? `&registration_end_date=${registartion_end_date}`
          : ''
      }`,
      header()
    );
  } catch (error) {
    return apiErrorHandling(error);
  }
};
