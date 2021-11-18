import React from 'react';
import './Homepage.css'
import OrganizedPng from './organized.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';




const Homepage = () => {
    return (
        <div >                        
            <Popup trigger={<button className="valid-button" style={{ marginLeft:"70%", position:"relative", marginTop:"25px" }} > Get Started </button>} position="right center">
            <div onClick={()=>console.log('clicked')}>{window.localStorage.getItem('token') ? "Head over to your tasks from the navbar!" : "You need to register/login to make tasks!"}</div>
            </Popup>            
        <div className="homepage">                                 
        <img src={`${OrganizedPng}`} alt="organized-png" style={{ height:"100vh"}}></img>
        </div>
        </div>
    )
}

export default Homepage;