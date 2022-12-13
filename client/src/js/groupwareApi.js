import axios from 'axios';

// 헤더 모음집

export const h1 = {
  'Content-Type': 'application/json',
};

export const h2 = {
  'Content-Type': 'application/json',
  // access_token: "bf284d40-9a76-11eb-a6b6-0800200c9a66",
};

// 공지사항 :
export const noticeList = async (type, value, currentPage) => {
  let params = {
    filter_type: type,
    filter_val: value,
    page: currentPage,
    limit: '9',
  };
  try {
    return await axios.get(`/bw/notice/list`, params, {
      header: h1,
    });
  } catch {
    return null;
  }
};
export const noticeInfo = async currentPage => {
  try {
    return await axios.get(`/bw/notice/read?page=${currentPage}&limit=9`, {
      header: h1,
    });
  } catch {
    return null;
  }
};
// 쿼리에 해당하는 상표의 개수를 가져오는 API
export const noticeCreate = async query => {
  try {
    return await axios.post(`/bw/notice/create`, query, { headers: h1 });
  } catch {
    return null;
  }
};

export const noticeUpdate = async query => {
  try {
    return await axios.post(`/bw/notice/update`, query, { headers: h1 });
  } catch {
    return null;
  }
};

export const noticeDelete = async query => {
  try {
    return await axios.post(`/bw/notice/create`, query, { headers: h1 });
  } catch {
    return null;
  }
};
