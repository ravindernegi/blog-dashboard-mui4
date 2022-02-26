import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import UserIcon from '@mui/icons-material/Person';
import PagesIcon from '@mui/icons-material/Pages';
import { MainLayout } from '../layout';
import ChangePasswordIcon from '@mui/icons-material/VpnKey';
import {
  LoginPage,
  ForgotPasswordPage,
  HomePage,
  UsersPage,
  UsersAddPage,
  DynamicPages,
  DynamicPageAdd,
  ChangePasswordPage,
} from '../pages';

export const routes = [
  {
    label: 'Login',
    path: '/login',
    page: LoginPage,
    requireAuth: false,
    asMenu: false,
  },
  {
    label: 'ForgotPassword',
    path: '/forgotpassword',
    page: ForgotPasswordPage,
    requireAuth: false,
    asMenu: false,
  },
  {
    label: 'Home',
    path: '/',
    page: HomePage,
    layoutType: MainLayout,
    requireAuth: true,
    asMenu: true,
    icon: <HomeIcon />,
  },
  {
    label: 'Users',
    path: '/users',
    page: UsersPage,
    layoutType: MainLayout,
    requireAuth: true,
    asMenu: true,
    icon: <UserIcon />,
  },
  {
    label: 'Add User',
    path: '/users/add',
    page: UsersAddPage,
    layoutType: MainLayout,
    requireAuth: true,
  },
  {
    label: 'Add User',
    path: '/users/:id',
    page: UsersAddPage,
    layoutType: MainLayout,
    requireAuth: true,
  },
  {
    label: 'Pages',
    path: '/pages',
    page: DynamicPages,
    layoutType: MainLayout,
    requireAuth: true,
    asMenu: true,
    icon: <PagesIcon />,
  },
  {
    label: 'Add Pages',
    path: '/pages/add',
    page: DynamicPageAdd,
    layoutType: MainLayout,
    requireAuth: true,
  },
  {
    label: 'Add Pages',
    path: '/pages/:id',
    page: DynamicPageAdd,
    layoutType: MainLayout,
    requireAuth: true,
  },
  {
    label: 'ChangePassword',
    path: '/changepassword',
    page: ChangePasswordPage,
    layoutType: MainLayout,
    requireAuth: true,
    asMenu: true,
    icon: <ChangePasswordIcon />,
  },
];
