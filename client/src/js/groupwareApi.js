import axios from 'axios';

// 공지사항 :
export const getNoticeList = async ({ page, limit = 9 }, type, value) => {
  try {
    return await axios.get(
      // `/bw/notice/list?page=${page}&limit=${limit}&filter_type=${type}&filter_val=${value}`
      `/notice/list?page=${page}&limit=${limit}&filter_type=${type}&filter_val=${value}`
    );
  } catch (error) {
    return;
  }
};

export const getNoticeInfo = async id => {
  try {
    // return await axios.get(`/bw/notice/info?/${id}`);
    return await axios.get(`/notice/info?/${id}`);
  } catch (error) {
    return;
  }
};

export const createNotice = async ({ title, content }) => {
  try {
    // return await axios.post(`/bw/notice/create`, {
    return await axios.post(`/notice/create`, {
      title: title,
      content: content,
    });
  } catch (error) {
    return;
  }
};

export const editNotice = async ({ title, content, id }) => {
  try {
    // return await axios.post(`/bw/notice/update`, {
    return await axios.post(`/notice/update`, {
      title: title,
      content: content,
      created_id: id,
    });
  } catch (error) {
    return;
  }
};

export const deleteNotice = async id => {
  try {
    // return await axios.post(`/bw/notice/create`, { notice_id: id });
    return await axios.post(`/notice/create`, { notice_id: id });
  } catch (error) {
    return;
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
