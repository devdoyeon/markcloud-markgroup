import axios from 'axios';

const apiErrorHandling = async error => {
  const { status } = error?.response;
  const { detail } = error?.response?.data;
  switch (status) {
    case 401:
      if (detail === 'Access Denied') return 'accessDenied';
      break;
    case 403:
      
    case 404:
      return 'notFound'
    case 422:
      switch (detail) {
        case 'InvalidClient':
          return 'NotAuthority';
        default:
          return '';
      }
    case 499:
      return 'tokenError';
    case 500:
    case 501:
      return 'serverError';
    default:
      return '';
  }
};

// ----------------------------------공지사항----------------------------------
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
// ----------------------------------업무 관리----------------------------------

export const getProjectRead = async ({ page, limit }) => {
  try {
    return await axios.get(`/bw/projects/read?limit=${limit}&page=${page}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const createProject = async ({
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

export const getProjectInfo = async id => {
  try {
    return await axios.get(`/bw/projects/info?project_id=${id}`);
  } catch (error) {
    return;
  }
};

// ----------------------------------사내 게시판----------------------------------

//= 게시판 리스트 불러오기
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

//= 게시판 상세내역 불러오기
export const getBoardDetail = async id => {
  try {
    return await axios.get(`/dy/board/detail?post_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//= 게시글 작성
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

//= 게시글 수정
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

//= 게시글 삭제
export const deleteBoard = async id => {
  try {
    return await axios.post(`/dy/board/delete?post_id=${id}&user_id=mxxvii`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//----------------------------------주간 업무 보고----------------------------------

//= 주간 업무 보고 불러오기
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

//= 주간 업무 보고 상세내역 불러오기
export const getReportDetail = async id => {
  try {
    return await axios.get(`/dy/report/detail?report_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//= 주간 업무 보고 등록
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

//= 주간 업무 보고 수정
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

//= 주간 업무 보고 삭제
export const deleteReport = async id => {
  try {
    return await axios.post(`/dy/report/delete?report_id=${id}&user_id=d`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

//----------------------------------프로젝트 현황----------------------------------

//= 프로젝트 현황 불러오기
export const getProjectList = async () => {
  try {
  } catch (error) {
    return apiErrorHandling(error);
  }
};
