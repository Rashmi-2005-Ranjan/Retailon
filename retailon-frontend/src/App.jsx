import Menubar from "./Components/Menubar/Menubar.jsx";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import ManageCategory from "./Pages/Manage Categories/ManageCategory.jsx";
import ManageUsers from "./Pages/Manage Users/ManageUsers.jsx";
import ManageItems from "./Pages/Manage Items/ManageItems.jsx";
import Explore from "./Pages/Explore/Explore.jsx";
import {Toaster} from "react-hot-toast";
import Login from "./Pages/Login/Login.jsx";
import Landing from "./Pages/Landing/Landing.jsx";
import OrderHistory from "./Pages/order History/OrderHistory.jsx";
import {AppContext} from "./Context/AppContext.jsx";
import {useContext} from "react";
import NotFound from "./Pages/Not Found/NotFound.jsx";

const App = () => {
    const { auth } = useContext(AppContext);
    const location = useLocation();

    const LoginRoute = ({element}) => {
        if(auth.token)
        {
            return <Navigate to="/dashboard" replace />;
        }
        return element;
    }
    const ProtectedRoute = ({element,allowedRoles}) => {
        if(!auth.token)
        {
            return <Navigate to="/login" replace />;
        }
        if(allowedRoles && !allowedRoles.includes(auth.role))
        {
            return <Navigate to="/dashboard" replace />;
        }
        return element;
    }

    // Hide Menubar on Landing and Login pages
    const hideMenu = location.pathname === "/" || location.pathname === "/login";

    return (
        <>
            {!hideMenu && <Menubar/>}
            <Toaster/>
            <Routes>
                {/* Common Routes */}
                <Route path="/" element={<Landing/>}/>
                <Route path="/login" element={<LoginRoute element={<Login />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />}/>} />
                <Route path="/explore" element={<ProtectedRoute element={<Explore />}/>}/>
                {/* Admin Only Routes */}
                <Route path="/category" element={<ProtectedRoute element={<ManageCategory />} allowedRoles={['ROLE_ADMIN']} />} />
                <Route path="/users" element={<ProtectedRoute element={<ManageUsers />} allowedRoles={["ROLE_ADMIN"]} />} />
                <Route path="/items" element={<ProtectedRoute element={<ManageItems />} allowedRoles={["ROLE_ADMIN"]} /> } />
                <Route path="/orders" element={<ProtectedRoute element={<OrderHistory />}/>}/>
                {/* Wildcard Route */}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    );
};

export default App;
