import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute'; 
import appRoutes from './data/routes';
import PageNotFound from './pages/404Page';
import Welcome from './pages/Welcome'; 
import { DiagnosisTest } from './pages/Diagnosis/DiagnosisTest';
import { ThankYou } from './pages/Diagnosis/ThankYou';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/welcome' replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/welcome',
        element: <Welcome />,
      },
      {
        path: "/diagnosis/test/:linkId/:token",
        element: <DiagnosisTest />,
      },
      {
        path: "/diagnosis/thank-you",
        element: <ThankYou />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: appRoutes,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

export default router;