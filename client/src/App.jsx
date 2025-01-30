import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';


function App() {
 
  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }

  return (
    <>
    <div className="container">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/newTask">New Task</Link>
        <Link to="/timeLine">Timeline</Link>
        <Link to="/settings">Settings</Link>
        <button onClick={logout}>Logout</button>
      </nav>
      <div className='body-info'>
        <Outlet />
      </div>
    </div>
    
      
    </>
  )
}

export default App;
