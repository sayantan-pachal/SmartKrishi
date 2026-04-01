import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    // ✅ FIXED: Changed 'smartkrishi_users' to 'smartkrishi_session'
    const session = JSON.parse(localStorage.getItem("smartkrishi_session"));

    if (!session || !session.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;