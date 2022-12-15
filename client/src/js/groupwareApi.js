import axios from 'axios';

// 공지사항 :
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
    return;
  }
};
export const getNoticeInfo = async id => {
  try {
    return await axios.get(`/bw/notice/info?notice_id=${id}`);
  } catch {
    return null;
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
    return;
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
    return;
  }
};

export const deleteNotice = async id => {
  try {
    const typeChange = parseInt(id);
    return await axios.post(`/bw/notice/delete?notice_id=${id}`);
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
    return;
  }
};

//= 게시판 상세내역 불러오기
export const getBoardDetail = async id => {
  try {
    return await axios.get(`/dy/board/detail?post_id=${id}`);
  } catch (error) {
    return;
  }
};

//= 게시글 작성
export const createBoard = async ({ title, content }) => {
  try {
    return await axios.post(`/dy/board/create`, {
      title: title,
      content: content,
      created_id: 'jenny',
      organ_code: 'markcloud',
    });
  } catch (error) {
    return;
  }
};

//= 게시글 수정
export const editBoard = async ({ title, content, created_id }, id) => {
  try {
    return await axios.post(`/dy/board/update?post_id=${id}`, {
      title: title,
      content: content,
      created_id: 'jenny',
      organ_code: 'markcloud',
    });
  } catch (error) {
    return;
  }
};

//= 게시글 삭제
export const deleteBoard = async id => {
  try {
    return await axios.post(`/dy/board/delete?post_id=${id}&user_id=mxxvii`);
  } catch (error) {
    return;
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
    return;
  }
};
