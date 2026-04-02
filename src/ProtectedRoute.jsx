import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { account } from "../src/appwrite/config";

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.get(); // checks current session
                setAuthorized(true);
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    if (loading) return null; // or loader

    if (!authorized) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;