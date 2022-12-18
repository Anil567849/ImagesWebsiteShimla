import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle';

function Header() {
    const navigate = useNavigate();

    
    const logout = async () => {
        const res = await fetch('/logout', {
            method : 'GET',
            headers : {
                Accept : 'application/json',
            },
            
        });

        const {loggedOut}  = await res.json();
        if(loggedOut){
            navigate('/login');
        }
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">            
            <NavLink className="navbar-brand" to="/">Navbar</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/cart">Cart</NavLink>
                </li>
                <li className="nav-item">                    
                    <NavLink className="nav-link" to="/download">My Downloads</NavLink>
                </li>
                <li className="nav-item">                    
                    <a className="nav-link" active="false" style={{cursor : 'pointer'}} onClick={logout}>Logout</a>
                </li>
                </ul>
                {/* <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form> */}
            </div>
        </div>
    </nav>
  )
}

export default Header