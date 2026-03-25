import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@pages/Home/HomePage'
import LoginPage from '@pages/Auth/LoginPage'
import RegisterPage from '@pages/Auth/RegisterPage'
import ProfilePage from '@pages/Profile/ProfilePage'
import CataloguePage from '@pages/Catalogue/CataloguePage'
import LibraryPage from '@pages/Library/LibraryPage'
import RootLayout from '@components/layout/RootLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogue', element: <CataloguePage /> },
      { path: 'connexion', element: <LoginPage /> },
      { path: 'inscription', element: <RegisterPage /> },
      { path: 'profil', element: <ProfilePage /> },
      { path: 'librarie', element: <LibraryPage /> },
    ],
  },
])