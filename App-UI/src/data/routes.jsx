import Home from "../pages/Home";
import NewDiagnosis from "../pages/Diagnosis/NewDiagnosis";
import EditDiagnosis from "../pages/Diagnosis/EditDiagnosis";

const appRoutes = [
    {
        path: '/Home',
        element: <Home /> 
    },
    {
        path: '/diagnosis/new',
        element: <NewDiagnosis />
    },
    {
        path: '/diagnosis/edit/:id', 
        element: <EditDiagnosis />
    }
]

export default appRoutes;