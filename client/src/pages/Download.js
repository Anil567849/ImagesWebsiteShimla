import React, { useEffect, useState, CSSProperties, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import io from "socket.io-client"; 
import 'react-toastify/dist/ReactToastify.css';
import PacmanLoader from "react-spinners/PacmanLoader";
import {UserContext} from '../App';
import Styles from '../component/downloadComponent/download.module.css';
import Card from '../component/downloadComponent/Card';





const socket = io("http://localhost:8000");


const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};



function Download() {

    const userId = Cookies.get('userId');
    const [files, setFiles] = useState([]);    
    const [disable, setdisabled] = useState(true);
    const {payId} = useParams();
    const navigate = useNavigate();
    const {state, dispatch} = useContext(UserContext);

    // SPINNER
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");


    
    // Check is user Authencate to access home page 
    const checkIsUserAuthenticate = async () => {
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
              throw new Error(res.error);
            }else{        
              dispatch({type : "USER", payload : data._id});
            }
          } catch (err) {
            console.log("home.js " + err);
            navigate("/login");
          }

    }


    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
      
    function formatDate(date) {
        return (
            [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
            ].join('/') +
            ' ' +
            [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }

    const getDownloadedFilesOfUser = async ()=> {
        // fetch all pay id of user from db 
        // console.log(userId);
        const result = await fetch('/getDownloadedFilesOfUserFromDB', {
            method : "POST",
            headers : {
                'Content-Type' : "application/json",
                Accept : "application/json",
            },
            body : JSON.stringify({
                userId,
            })
        })

        const {foundPayIds} = await result.json();
        // console.log(foundPayIds);
        
        if(foundPayIds){
            for(let val of foundPayIds){
                const payId = val.payId;
                const timestamp = Number(val.purchaseDate);
                const purchaseDate = formatDate(new Date(timestamp));
                setFiles(oldVal => [...oldVal, {payId, purchaseDate}]);
            }
        }else{
            console.log('no images purchased');
        }

        
    }

    useEffect(() => {
        checkIsUserAuthenticate();
        getDownloadedFilesOfUser(); // get all downloaded files of this user
    }, [])
       
    
    socket.on('archive_created', (enable)=>{
        if(enable){
            navigate('/download');
        }
    });


  return (
      <div>
        <h1 className={Styles.heading}>Download Files</h1>
            {(payId === undefined) ? 
                
                <div className="row">
                {
                files.map((val, i) => {
                    return (
                        <Card key={i} fileName={val.payId} go_to={`/download/${val.payId}.zip`} date={val.purchaseDate}/>
                        )
                    })
                }
                </div> : <div className='d-flex justify-content-center align-items-center' style={{height : '80vh', width : '100vw'}}>
                            <PacmanLoader color="#36d7b7" />
                            <p>Please wait, Download in Progress...</p>
                        </div> 
            
            }

 
    </div>
  )
}



export default Download