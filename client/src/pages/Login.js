import React, {useState, useContext, useEffect, useRef} from 'react'
import {NavLink, useNavigate, useParams } from 'react-router-dom';
import {UserContext} from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Styles from '../component/authComponent/login.module.css';
import GoogleSignupButton from '../component/authComponent/GoogleSignupButton';

const Login = ()=> {

    const navigate = useNavigate();
    const go_to_login = useRef();

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
      
            if ((res.status !== 200) || !data) {                 
                dispatch({type : "USER", payload : null});
                navigate("/login");
            }else{
                navigate("/");
            }
          } catch (err) {
            console.log("login.js " + err);
            navigate("/login");
          }

    }

    useEffect(() => {
        isAuthenticate();
    }, [])


    const {state, dispatch} = useContext(UserContext);       
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userLogin = async (e) => {
        // console.log("clicked");
        e.preventDefault();
        
        const res = await fetch('/login', {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                email : email,
                password : password
            })
        });

        const data = await res.json();

        // console.log('login', data);

        if(res.status === 422 || res.status === 400 || !data){
            // console.log("login failed");
            wrongEmailAndPassword();
        }else{
            dispatch({type : "USER", payload : data});
            // console.log("log in success");
            navigate("/");
        }
    }


    const googleAuth = () => {
        window.open(
            "http://localhost:8000/google/callback", "_self"
        )
    }
    

    const wrongEmailAndPassword = () => {
        toast.success('Wrong Email and Password', {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
    
    }


  
    return(
        <div className={`container-fluid row m-0 p-0 ${Styles.container}`}>

                <div className={`col-md-8 ${Styles.outsideFormDiv}`}>

                    <form onSubmit={userLogin} method="POST">
                        <div className="mb-1">
                            <label htmlFor="email" name="email" className="form-label">Email</label>    
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" aria-describedby="emailHelp" required/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="password" name="password" className="form-label">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" required/>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">log in</button>
                    </form>

                    <GoogleSignupButton text="Sign in with Google" googleAuth={googleAuth} />

                    <NavLink className={Styles.dontHaveAccount} to="/signup"><p>Don't Have Account?</p></NavLink>
                
                </div> 
            <ToastContainer/>
         </div>
    )

}

export default Login
