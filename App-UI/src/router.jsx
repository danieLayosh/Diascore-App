import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute'; 
import appRoutes from './data/routes';
import PageNotFound from './pages/404Page';
import Welcome from './pages/Welcome'; 
import { DiagnosisTest } from './pages/Diagnosis/DiagnosisTest';

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
        path: "/diagnosis/test/:linkId",
        element: <DiagnosisTest />,
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