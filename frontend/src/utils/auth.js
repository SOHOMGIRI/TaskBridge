export const getToken = () => localStorage.getItem('icockroach_token');

export const getUser = () => {
  try {
    const raw = localStorage.getItem('icockroach_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuth = (token, user) => {
  localStorage.setItem('icockroach_token', token);
  localStorage.setItem('icockroach_user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
};

export const clearAuth = () => {
  localStorage.removeItem('icockroach_token');
  localStorage.removeItem('icockroach_user');
  window.dispatchEvent(new Event('auth-change'));
};

export const getDashboardPath = (userType) => {
  if (userType === 'Admin') return '/admin';
  return userType === 'Business' ? '/business-dashboard' : '/student-dashboard';
};
