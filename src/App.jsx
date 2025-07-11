import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import OTP from "./pages/OTP";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";




const melAnuRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/about', element: <About /> },
  { path: '/otp', element: <OTP /> },
  { path: '/products', element: <Products /> },
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
