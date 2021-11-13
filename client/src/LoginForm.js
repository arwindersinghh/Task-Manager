/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function LoginForm() {    
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const history = useNavigate();
    
    

    async function handleSubmit(e){
        e.preventDefault();
        
        const user = await axios.post("/api/users/login", {email, password})
        
        window.localStorage.setItem('token', user.data.token);

        history('/me')

    }
    
    function handleChange(e){
        if(e.target.name === 'email') {
            setEmail(e.target.value);
        }            
        else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }           
    }

    
    return (<div>
        Please Login :
    <form onSubmit={handleSubmit}>
        Email:
            <input name="email" type="text" value={email} onChange={handleChange} />        
        Password:
            <input name="password" type="password" value={password} onChange={handleChange} />
            <button type="submit"> Enter </button>
    </form>
    
    </div>)
}


export default LoginForm