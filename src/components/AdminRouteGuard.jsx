import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function AdminRouteGuard({ children }) {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminAccess = () => {
            try {
                const token = localStorage.getItem('token');
                const userRole = localStorage.getItem('userRole');
                const isAuthenticated = localStorage.getItem('isAuthenticated');

                console.log('AdminRouteGuard - Checking access:', {
                    token: !!token,
                    userRole,
                    isAuthenticated
                });

                // Check if all required conditions are met
                if (!token || !isAuthenticated || userRole !== 'admin') {
                    console.log('AdminRouteGuard - Access denied, redirecting to login');
                    setIsAuthorized(false);
                    setIsLoading(false);
                    navigate('/login', { replace: true });
                    return;
                }

                console.log('AdminRouteGuard - Access granted');
                setIsAuthorized(true);
                setIsLoading(false);

            } catch (error) {
                console.error('AdminRouteGuard - Error checking access:', error);
                setIsAuthorized(false);
                setIsLoading(false);
                navigate('/login', { replace: true });
            }
        };

        checkAdminAccess();
    }, [navigate]);

    // Show loading spinner while checking authorization
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    // Only render children if authorized
    return isAuthorized ? children : null;
}