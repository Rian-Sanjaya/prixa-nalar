export const changeTheme = (theme: any) => {
  if (theme && theme.primary) {
    document.documentElement.style.setProperty('--primary', `${theme.primary}`);
    document.documentElement.style.setProperty('--primary-80', `${theme.primary}CC`);
  }

  if (theme && theme.secondary) {
    document.documentElement.style.setProperty('--secondary', `${theme.secondary}`);
    document.documentElement.style.setProperty('--secondary-80', `${theme.secondary}CC`);
  }

  if (theme && theme.dark) {
    document.documentElement.style.setProperty('--dark', `${theme.dark}`);
  }

  if (theme && theme.muted) {
    document.documentElement.style.setProperty('--muted', `${theme.muted}`);
    document.documentElement.style.setProperty('--grey', `${theme.muted}E6`);
  }

  if (theme && theme.light) {
    document.documentElement.style.setProperty('--light', `${theme.light}`);
  }

  if (theme && theme.success) {
    document.documentElement.style.setProperty('--success', `${theme.success}`);
  }

  if (theme && theme.alert) {
    document.documentElement.style.setProperty('--alert', `${theme.alert}`);
  }

  if (theme && theme.warning) {
    document.documentElement.style.setProperty('--warning', `${theme.warning}`);
  }

  document.documentElement.style.setProperty('--alert-50', `${(theme && theme.alert) || '#FF6E5D'}80`);

  document.documentElement.style.setProperty('--primary-40', `${(theme && theme.primary) || '#0146AB'}66`);

  document.documentElement.style.setProperty('--success-40', `${(theme && theme.primary) || '#44CD90'}66`);

  document.documentElement.style.setProperty('--dark-10', `${(theme && theme.dark) || '#4C4F54'}1a`);
  document.documentElement.style.setProperty('--dark-20', `${(theme && theme.dark) || '#4C4F54'}29`);
  document.documentElement.style.setProperty('--dark-40', `${(theme && theme.dark) || '#4C4F54'}66`);
  document.documentElement.style.setProperty('--dark-50', `${(theme && theme.dark) || '#4C4F54'}80`);
  document.documentElement.style.setProperty('--dark-60', `${(theme && theme.dark) || '#4C4F54'}99`);
  document.documentElement.style.setProperty('--dark-80', `${(theme && theme.dark) || '#4C4F54'}CC`);
};
