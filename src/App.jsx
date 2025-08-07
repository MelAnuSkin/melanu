import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import OTP from "./pages/OTP";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UserPage from "./pages/UserPage";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ConfirmPassword from "./pages/ConfirmPassword";
import MakePayment from "./pages/MakePayment";
import AdminRouteGuard from "./components/AdminRouteGuard";

const melAnuRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/about', element: <About /> },
  { path: '/otp', element: <OTP /> },
  { path: '/products', element: <Products /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/userpage', element: <UserPage /> },
  { path: '/contact', element: <Contact /> },
  { path: '/blog', element: <Blog /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/confirm-password', element: <ConfirmPassword /> },
  { path: '/makepayment', element: <MakePayment /> },
  { path: '/admin', element: (<AdminRouteGuard> <Admin /></AdminRouteGuard> )},
  { path: '/*', element: <NotFound /> },
]);

function App() {
 
  return (
    <>
       <RouterProvider router={melAnuRouter} />
    </>
  )
}

export default App