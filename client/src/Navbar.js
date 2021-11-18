import React, {useState, useEffect} from 'react';
import "./Navbar.css"
import { Link, useNavigate } from 'react-router-dom';





const Navbar = () => {

    

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const history = useNavigate();

    const token = window.localStorage.getItem('token')
    
    useEffect(() => {
        setIsLoggedIn(token);
    }, [token])

    
    
    

        

        const logout = async() => {    
            window.localStorage.removeItem('token');
            //console.log(window.localStorage.getItem('token'))
            setIsLoggedIn(false);

            history('/home')
          }

          if(!isLoggedIn){
              <div> You've been logged out !</div>
          }

        // return(<div className="parent-container">
        //     <Link to="/home"> <button> Home </button> </Link>
        //     {!token ? <Link to="/login"><button> Login </button> </Link> : null }
        //     {isLoggedIn ? <Link to="/me"> <button> Userpage </button></Link> :
        //     null}
        //     {!token ? <Link to="/signup"><button> Sign Up </button></Link> :
        //     <li>{ isLoggedIn ? <button style={{ color: "red", width:"100px", height:"30px"}} onClick={logout}> Logout </button> : null }</li>}
        // </div>)
        return(
            <nav className="nav_links">
                <li><Link to="/home"> Home </Link></li>
                <li><Link to="/"> {window.localStorage.getItem('token') ? "Tasks" : "Login"} </Link></li>
                {window.localStorage.getItem('token') ? null : <li><Link to="/signup"> Register </Link></li>}
                {window.localStorage.getItem('token') ? <li onClick={() => window.localStorage.removeItem('token')}><Link to="/home"> Logout </Link></li> : null }
            </nav> 
        )
    
    
}

export default Navbar;