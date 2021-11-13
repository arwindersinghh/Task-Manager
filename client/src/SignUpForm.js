/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm'
import { Link } from 'react-router-dom'

function SignUpForm() {
    const [name, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    
    
    

    async function handleSubmit(e){
        e.preventDefault();
        
        const user = await axios.post("/api/users", {name, email, password})
        
        window.localStorage.setItem('token', user.data.token);
        window.location.reload();
    }
    
    function handleChange(e){
        if(e.target.name === 'email') {
            setEmail(e.target.value);
        }
        else if(e.target.name === 'name') {
        setUsername(e.target.value);     
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }   
        
    }


    
    
    return (<div>
        Please register an account :
    <form onSubmit={handleSubmit}>
        Email:
            <input name="email" type="text" value={email} onChange={handleChange} />
        Username:
            <input name="name" type="text" value={name} onChange={handleChange} />                                                
        Password:
            <input name="password" type="password" value={password} onChange={handleChange} />
            <button type="submit"> Enter </button>
    </form>
    <Link to="/login"><button> Already have an account ?</button></Link>
    </div>)
}


export default SignUpForm