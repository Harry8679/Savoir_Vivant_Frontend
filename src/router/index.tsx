  import { createBrowserRouter } from 'react-router-dom'
  import HomePage            from '@pages/Home/HomePage'
  import LoginPage           from '@pages/Auth/LoginPage'
  import RegisterPage        from '@pages/Auth/RegisterPage'
  import ForgotPasswordPage  from '@pages/Auth/ForgotPasswordPage'
  import ProfilePage         from '@pages/Profile/ProfilePage'
  import CataloguePage       from '@pages/Catalogue/CataloguePage'
  import BookDetailPage      from '@pages/Catalogue/BookDetailPage'
  import LibraryPage         from '@pages/Library/LibraryPage'
  import OrdersPage          from '@pages/Orders/OrdersPage'
  import SubscriptionPage    from '@pages/Subscription/SubscriptionPage'
  import SettingsPage        from '@pages/Settings/SettingsPage'
  import NotFoundPage        from '@pages/NotFound/NotFoundPage'
  import CguPage             from '@pages/Legal/CguPage'
  import ConfidentialitePage from '@pages/Legal/ConfidentialitePage'
  import RootLayout          from '@components/layout/RootLayout'
  import PrivateRoute        from './PrivateRoute'
  import AdminLayout        from '@pages/Admin/AdminLayout'
  import AdminDashboard     from '@pages/Admin/AdminDashboard'
  import AdminBooks         from '@pages/Admin/AdminBooks'
  import AdminBookForm      from '@pages/Admin/AdminBookForm'
  import AdminCollections   from '@pages/Admin/AdminCollections'
  import AdminCarriers      from '@pages/Admin/AdminCarriers'
  import AdminOrders        from '@pages/Admin/AdminOrders'
  import AdminRoute         from './AdminRoute'
  import AddressesPage from '@/pages/Settings/AddressesPage'
  import CheckoutPage from '@/pages/Checkout/CheckoutPage'
  import CartPage from '@/pages/Cart/CartPage'
  import CheckoutSuccessPage from '@/pages/Checkout/CheckoutSuccessPage'

  export const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true,                element: <HomePage /> },
        { path: 'catalogue',          element: <CataloguePage /> },
        { path: 'catalogue/:slug',    element: <BookDetailPage /> },
        { path: 'cgu',                element: <CguPage /> },
        { path: 'confidentialite',    element: <ConfidentialitePage /> },
        { path: 'settings/addresses', element: <AddressesPage /> },
        { path: 'checkout',           element: <CheckoutPage /> },
        { path: 'cart', element: <CartPage /> },
        {
          element: <PrivateRoute />,
          children: [
            { path: 'profile',      element: <ProfilePage /> },
            { path: 'library',      element: <LibraryPage /> },
            { path: 'orders',       element: <OrdersPage /> },
            { path: 'subscription', element: <SubscriptionPage /> },
            { path: 'settings',     element: <SettingsPage /> },
            { path: 'checkout/success',  element: <CheckoutSuccessPage /> },
          ],
        },
      ],
    },
    { path: '/connexion',           element: <LoginPage /> },
    { path: '/login',               element: <LoginPage /> },
    { path: '/inscription',         element: <RegisterPage /> },
    { path: '/register',            element: <RegisterPage /> },
    { path: '/forgot-password',     element: <ForgotPasswordPage /> },
    { path: '/mot-de-passe-oublie', element: <ForgotPasswordPage /> },
    {
      path: '/admin',
      element: <AdminRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true,              element: <AdminDashboard /> },
            { path: 'books',            element: <AdminBooks /> },
            { path: 'books/new',        element: <AdminBookForm /> },
            { path: 'books/:id/edit',   element: <AdminBookForm /> },
            { path: 'collections',      element: <AdminCollections /> },
            { path: 'carriers',         element: <AdminCarriers /> },
            { path: 'orders',           element: <AdminOrders /> },
          ],
        },
      ],
    },
    { path: '*',                    element: <NotFoundPage /> },
  ])