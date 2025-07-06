import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";




const melAnuRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
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
