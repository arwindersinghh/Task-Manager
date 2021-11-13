
import SignUpForm from './SignUpForm';
import UserPage from './UserPage';
import Homepage from './Homepage';
import LoginForm from './LoginForm';
//import LoginForm from './LoginForm'
import { useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



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
    <div style={{ marginLeft:"50px" }}className="App">
      <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="/home" element={<Homepage />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/me" element={<UserPage />} />
      </Routes>
    {/* { isLoggedIn ? <button style={{ float: "right", color:"red", marginTop:"10px", width:"100px", height:"30px"}} onClick={logout}> Logout </button> : null } */}
      {/* { isLoggedIn ? <UserPage /> : <SignUpForm /> }       */}
      {/* { !isLoggedIn ? <button onClick={() => setHasAccount(true)}> Already have an account ?</button> : null} */}      
      </BrowserRouter>
    </div>
    
  );
}

export default App;
