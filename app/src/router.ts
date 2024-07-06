import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { supabase } from '@/services/supabase';
import { fetchLinkBySlug } from '@/services/links'; // Import the function

import SignInRoute from '@/routes/public/sign-in';

const NotFoundRoute = () => import('@/routes/admin/not-found');
const DashboardRoute = () => import('@/routes/admin/dashboard');
const ManageLinkRoute = () => import('@/routes/admin/links/manage');
const CreateLinkRoute = () => import('@/routes/admin/links/create');
const SettingsRoute = () => import('@/routes/admin/settings');

const defaultTitle = 'Supaflare';

let appStore: any;

export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Sign In',
    component: SignInRoute,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardRoute,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/links',
    name: 'Manage Links',
    component: ManageLinkRoute,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/link/create',
    name: 'Create Link',
    component: CreateLinkRoute,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsRoute,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:_(.+)+',
    name: 'Page Not Found',
    component: NotFoundRoute,
    meta: {
      requiresAuth: true,
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: defaultRoutes,
});

router.beforeEach(async (to, from, next) => {
  if (!appStore) {
    appStore = useAppStore();
  }

  if (!from.name) {
    appStore.initialPath = to.path;
  }

  const currentDate = new Date();

  if (to.path !== '/' && appStore.supabaseSession) {
    const { data: link, error } = await fetchLinkBySlug(to.path.substring(1)); // Fetch the link by slug
    if (link) {
      const startDate = new Date(link.start_date);
      const endDate = new Date(link.end_date);
      if (currentDate < startDate || currentDate > endDate) {
        next({ path: '/not-found' });
        return;
      }
    }
  }

  if (to.path === '/' && appStore.supabaseSession) {
    next({ path: '/links' });
    return;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!appStore.supabaseSession) {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.name ? String(to.name) : defaultTitle;
});

supabase.auth.onAuthStateChange((event, session) => {
  if (!appStore) {
    appStore = useAppStore();
  }

  appStore.supabaseSession = session;

  if (appStore.initialPath) {
    const initialPath = appStore.initialPath;
    appStore.initialPath = '';
    router.push(initialPath);
  }
});
