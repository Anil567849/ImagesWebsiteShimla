import React, {useState, useEffect, useContext} from 'react'
import { NavLink, useNavigate} from 'react-router-dom';
import {UserContext} from '../App';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Styles from './css/signup.module.css'
const Signup = ()=> {

    const isAuthenticate = async () => {
        try {
            const res = await fetch("/home", {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
      
            const data = await res.json();

            // console.log(data);
      
            if ((res.status !== 200) | !data) { 
                dispatch({type : "USER", payload : null});               
                navigate("/signup");
            }else{
                navigate("/");
            }
          } catch (err) {
            console.log("signup.js " + err);
            navigate("/signup");
          }

    }

    useEffect(() => {
        isAuthenticate();
    }, [])


    const {state, dispatch} = useContext(UserContext);   
    const [user, setUser] = useState({
        name : "", 
        email : "",
        phone : "",
        password : "",
        cpassword : ""
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        let name = e.target.name;
        let val = e.target.value;

        // console.log(e.target.name);

        setUser({...user, [name] : val});
    }

    const postData = async (e)=> {
        e.preventDefault();
        let {name, email, phone, password, cpassword} = user;
        // console.log(user);

        try{
            const res = await fetch("/register", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    name : name,
                    email : email,
                    phone : phone,
                    password : password,
                    cpassword : cpassword
                })
            });

            const data = await res.json();

            // console.log(res);

            if(res.status === 422 || !data){
                console.log("registration failed  signup.js");
            }else{
                console.log('success');
                navigate('/');
            }


        }catch(err){
            console.log("Error signup.js " + err);
        }
    }

    const googleAuth = () => {
        window.open(
            "http://localhost:8000/google/callback", "_self"
        )
    }

    return ( 
        <div className={`container-fluid row m-0 p-0 ${Styles.container}`}>
                <div className={`col-md-8 container ${Styles.outsideFormDiv}`}>
                    <form onSubmit={postData} method="POST">                    
                        <div className="mb-1 mt-2">
                            <label htmlFor="name" className="form-label">Name*</label>
                            <input value={user.name}  name="name" onChange={handleChange} type="text" className="form-control" id="name" required/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="email" className="form-label">Email*</label>
                            <input value={user.email}  name="email" onChange={handleChange} type="email" className="form-control" id="email" aria-describedby="emailHelp" required/>
                        </div>
                            <div className="mb-1">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input value={user.phone}  name="phone" onChange={handleChange} type="text" className="form-control" id="phone"/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="password"  className="form-label">Password*</label>
                            <input value={user.password} name="password" onChange={handleChange} type="text" className="form-control" id="password" required/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="cpassword"  className="form-label">Confirm password*</label>
                            <input value={user.cpassword} name="cpassword" onChange={handleChange} type="text" className="form-control" id="cpassword" required/>
                        </div>
                        <button type="submit"  className="btn btn-primary mt-3">Sign up</button>
                    </form>
                    <button className={Styles.google_btn} onClick={googleAuth}>
						<img src="./images/icons/google.svg" alt="google icon" />
						<span>Sign up with Google</span>
					</button>
                    <NavLink className={Styles.haveAccount} to="/login"><p>Already Have Account?</p></NavLink>

            </div>

        </div>
    )

}

export default Signup