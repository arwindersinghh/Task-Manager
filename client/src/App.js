
//import SignUpForm from './SignUpForm';
import SignUp from './SignUp';
import UserPage from './UserPage';
import Homepage from './Homepage';
import SignIn from './SignIn'
//import LoginForm from './LoginForm'
//import { useState } from 'react';
import Navbar from './Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'





function App() {  
  //const [isLoggedIn, setLoginStatus] = useState(window.localStorage.getItem('token'))
  
  

  // async function logout(){    
  //   window.localStorage.removeItem('token');
  //   console.log(window.localStorage.getItem('token'))
  //   setLoginStatus(false);    
  // }
  
  

  // if(hasAccount){
  //   return (
  //     <LoginForm />
  //   )
  // }

  

  return (
    // IMPORT STATEMENT SEEMS TO BE FETCHING FROM WRONG PATH HERE
    <div className="App">
      <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="/home" element={<Homepage />} />
      <Route path="/signup" element={<SignUp />} />      
      <Route path="/me" element={<UserPage />} />
      <Route path="/" element={<SignIn />} />
      </Routes>
    {/* { isLoggedIn ? <button style={{ float: "right", color:"red", marginTop:"10px", width:"100px", height:"30px"}} onClick={logout}> Logout </button> : null } */}
      {/* { isLoggedIn ? <UserPage /> : <SignUpForm /> }       */}
      {/* { !isLoggedIn ? <button onClick={() => setHasAccount(true)}> Already have an account ?</button> : null} */}      
      </BrowserRouter>
    </div>
    
  );
}

export default App;
