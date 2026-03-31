import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Login from "./components/Login";
import Admin from "./components/Admin";
import Design from "./components/Design";
import Production from "./components/Production";
import Sales from "./components/Sales";


function App() {
 const router=createBrowserRouter([
  {path:"/",element:<Login/>},
   {path:"/admin",element:<Admin/>},
   {path:"/design",element:<Design/>},
   {path:"/production",element:<Production/>},
   {path:"/sales",element:<Sales/>}

 ]);
 return <RouterProvider router={router} />
}

export default App;