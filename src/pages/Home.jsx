import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import UserNav from "../components/UserNav";
import Hero from "../components/Hero";
import ProductRange from "../components/ProductRange";
import SheaStrong from "../components/SheaStrong";
import CustomerReview from "../components/CustomerReview";
import Footer from "../components/Footer";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isAuth = localStorage.getItem('isAuthenticated');
            
            if (token && isAuth) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

       
        checkAuth();

        
        window.addEventListener('storage', checkAuth);
        
        
        window.addEventListener('authChanged', checkAuth);

        
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChanged', checkAuth);
        };
    }, []);

    return (
        <>
            
            {isAuthenticated ? <UserNav /> : <Navbar />}
            
            <Hero />
            <ProductRange />
            <SheaStrong />
            <CustomerReview />
            <Footer />
        </>
    );
}