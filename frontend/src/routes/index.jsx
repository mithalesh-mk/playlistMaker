import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from '../App';
import ProtectedRoute from '@/ProtecedRoute';
import Sidebar from '@/app/dashboard/Sidebar';
import PlaylistLoading from '@/app/playlist/playlistLoading';
import Help from '@/app/help/Help';

// Lazy-loaded Components
const Login = lazy(() => import('../app/login/Login'));
const Home = lazy(() => import('../app/dashboard/Home'));
const Signup = lazy(() => import('@/app/signup/Signup'));
const Profile = lazy(() => import('@/app/profile/Profile'));
const ChooseAvatar = lazy(() => import('@/app/avatar/ChooseAvatar'));
const Playlists = lazy(() => import('@/app/playlist/Playlists'));
const BookMarks = lazy(() => import('@/app/bookmark/BookMarks'));
const Playlist = lazy(() => import('@/app/playlist/Playlist'));
const ForgotPassword = lazy(() => import('@/app/login/Forgot-password'));
const Feedback = lazy(() => import('@/app/feedback/Feedback'));
import Search from '@/app/search/Search';
import FeaturedListLoader from '@/app/dashboard/FeaturedListLoader';
const Notification = lazy(() => import('@/app/Notification'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<FeaturedListLoader/>}>
                <Home />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: '/signup',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: '/profile',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      },
      {
        path: '/choose-avatar',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChooseAvatar />
          </Suspense>
        ),
      },
      {
        path: '/playlists',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Playlists />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      },
      {
        path: '/bookmarks',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <BookMarks />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      },
      {
        path: '/playlists/:playlistId',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<PlaylistLoading />}>
                <Playlist />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: '/notifications',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Notification />
          </Suspense>
        ),
      },
      {
        path: '/feedback',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Feedback />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      },
      {
        path: '/search',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Search />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      },
      {
        path: '/help',
        element: (
          <Sidebar>
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Help />
              </Suspense>
            </ProtectedRoute>
          </Sidebar>
        ),
      }
    ],
  },
]);

export default router;
