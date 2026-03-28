import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@pages/Home/HomePage'
import LoginPage from '@pages/Auth/LoginPage'
import RegisterPage from '@pages/Auth/RegisterPage'
import ForgotPasswordPage from '@pages/Auth/ForgotPasswordPage'
import ProfilePage from '@pages/Profile/ProfilePage'
import CataloguePage from '@pages/Catalogue/CataloguePage'
import LibraryPage from '@pages/Library/LibraryPage'
import NotFoundPage from '@pages/NotFound/NotFoundPage'
import CguPage from '@pages/Legal/CguPage'
import ConfidentialitePage from '@pages/Legal/ConfidentialitePage'
import RootLayout from '@components/layout/RootLayout'
import PrivateRoute from './PrivateRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,      element: <HomePage /> },
      { path: 'catalogue', element: <CataloguePage /> },
      { path: 'cgu',       element: <CguPage /> },
      { path: 'confidentialite', element: <ConfidentialitePage /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'library', element: <LibraryPage /> },
        ],
      },
    ],
  },
  { path: '/connexion',           element: <LoginPage /> },
  { path: '/register',            element: <RegisterPage /> },
  { path: '/inscription',         element: <RegisterPage /> },
  { path: '/forgot-password',     element: <ForgotPasswordPage /> },
  { path: '/mot-de-passe-oublie', element: <ForgotPasswordPage /> },
  { path: '*',                    element: <NotFoundPage /> },
])