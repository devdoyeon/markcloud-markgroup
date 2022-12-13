import axios from 'axios';

// 공지사항 :
export const noticeList = async (type, value, currentPage) => {
  let params = {
    filter_type: type,
    filter_val: value,
    page: currentPage,
    limit: '9',
  };
  try {
    return await axios.get(`/bw/notice/list`, params);
  } catch {
    return null;
  }
};
export const noticeInfo = async id => {
  try {
    return await axios.get(`/bw/notice/info?notice_id=${id}`);
  } catch {
    return null;
  }
};
// 쿼리에 해당하는 상표의 개수를 가져오는 API
export const noticeCreate = async query => {
  try {
    return await axios.post(`/bw/notice/create`, query);
  } catch {
    return null;
  }
};

export const noticeUpdate = async query => {
  try {
    return await axios.post(`/bw/notice/update`, query);
  } catch {
    return null;
  }
};

export const noticeDelete = async query => {
  try {
    return await axios.post(`/bw/notice/create`, query);
  } catch {
    return null;
  }
};

// -------------------------------------------------------------------------------

export const getBoardList = async ({ page, limit = 9 }, type, value) => {
  try {
    return await axios.get(
      `/dy/board/list?page=${page}&limit=${limit}&filter_type=${type}&filter_val=${value}`
    );
  } catch (error) {
    return;
  }
};

export const getBoardDetail = async id => {
  try {
    return await axios.get(`/dy/board/detail/${id}`);
  } catch (error) {
    return;
  }
};

export const createBoard = async ({ title, content }) => {
  try {
    return await axios.post(`/dy/board/create`, {
      title: title,
      content: content,
    });
  } catch (error) {
    return;
  }
};

export const editBoard = async ({ title, content, id }) => {
  try {
    return await axios.post(`/dy/board/update`, {
      title: title,
      content: content,
      post_id: id,
    });
  } catch (error) {
    return;
  }
};

export const deleteBoard = async id => {
  try {
    return await axios.post(`/dy/board/delete`, { post_id: id });
  } catch (error) {
    return;
  }
};
