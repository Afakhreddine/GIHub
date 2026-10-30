export const PUBLIC_TABS = ['home', 'guidelines', 'weekly', 'schedule', 'education', 'profile'];

export function publicTabForPath(pathname) {
  const tab = pathname.replace(/^\/+|\/+$/g, '');
  return PUBLIC_TABS.includes(tab) ? tab : 'home';
}

export function publicPathForTab(tab) {
  return tab === 'home' || !PUBLIC_TABS.includes(tab) ? '/' : `/${tab}`;
}
