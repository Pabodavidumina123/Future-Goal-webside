import api from './api';

export const getCourses = async (params = {}) => {
  // params: { page, pageSize, search, category, level, feeMin, feeMax, sort }
  const query = new URLSearchParams();
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      query.append(k, params[k]);
    }
  });

  const res = await api.get(`/courses?${query.toString()}`);
  return res.data;
};

export default { getCourses };
