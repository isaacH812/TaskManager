import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from "./Task.jsx"
import Newtask from "./newTask.jsx"
import Timeline from "./Timeline.jsx"
import Settings from "./settings.jsx"
import './index.css'
import 'vite/modulepreload-polyfill'
import{
    createHashRouter,
    RouterProvider
} from "react-router-dom";

const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />            
            },
            {
                path: "/newTask",
                element: <Newtask />            
            },
            {
                path: "/timeLine",
                element: <Timeline />            
            },
            {
                path: "/settings",
                element: <Settings />
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
<>
<RouterProvider router={router} />
</>
    
 
)
