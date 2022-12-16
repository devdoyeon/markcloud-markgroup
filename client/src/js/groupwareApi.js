import axios from 'axios';

const apiErrorHandling = async error => {
  console.log(error);
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

// ----------------------------------인사 관리----------------------------------
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~department~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const getDepartmentList = async ({ page, limit }) => {
  try {
    return await axios.get(
      `/bw/personnel/department/list?page=${page}&limit=${limit}`
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

export const getDepartmentCreate = async name => {
  try {
    return await axios.post(`/bw/personnel/department/create`, {
      department_name: name,
    });
  } catch (error) {
    return apiErrorHandling(error);
  }
};

export const getDepartmentUpdate = async (id, name) => {
  try {
    return await axios.post(
      `/bw/personnel/department/update?department_id=${id}`,
      {
        department_name: name,
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
      `/bw/personnel/member/list?page=${page}&limit=${limit}`
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

export const getMemberCreate = async () => {
  try {
    return await axios.post(`/bw/personnel/member/create`);
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

export const getReportDetail = async id => {
  try {
    return await axios.get(`/dy/report/detail?report_id=${id}`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};

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

export const deleteReport = async id => {
  try {
    return await axios.post(`/dy/report/delete?report_id=${id}&user_id=d`);
  } catch (error) {
    return apiErrorHandling(error);
  }
};
