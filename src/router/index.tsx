import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@pages/Home/HomePage'
import LoginPage from '@pages/Auth/LoginPage'
import RegisterPage from '@pages/Auth/RegisterPage'
import ProfilePage from '@pages/Profile/ProfilePage'
import CataloguePage from '@pages/Catalogue/CataloguePage'
import LibraryPage from '@pages/Library/LibraryPage'
// import NotFoundPage from '@pages/NotFound/NotFoundPage'
import RootLayout from '@components/layout/RootLayout'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogue', element: <CataloguePage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'library', element: <LibraryPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/connexion', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/inscription', element: <RegisterPage /> },
  { path: '*', element: <NotFoundPage /> },
])