import axios from 'axios';

// 공지사항 :
export const getNoticeList = async ({ page, limit = 9 }, type, value) => {
  try {
    if (type === '') {
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
    // return await axios.post(`/bw/notice/create`, {
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
    // return await axios.post(`/bw/notice/create`, { notice_id: id });
    const typeChange = parseInt(id);
    // return await axios.post(`/bw/notice/delete`, { notice_id: typeChange });
    return await axios.post(`/bw/notice/delete?notice_id=${id}`);
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
  console.log(id);
  try {
    return await axios.get(`/dy/board/detail?post_id=${id}`);
  } catch (error) {
    return;
  }
};

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

export const deleteBoard = async id => {
  try {
    return await axios.post(`/dy/board/delete`, { post_id: id });
  } catch (error) {
    return;
  }
};
