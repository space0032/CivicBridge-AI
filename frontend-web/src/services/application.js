import api from './api';

const applicationService = {
  getAll: () => {
    return api.get('/applications');
  },
  getById: (id) => {
    return api.get(`/applications/${id}`);
  },
  submit: (data) => {
    return api.post('/applications', data);
  },
};

export default applicationService;
