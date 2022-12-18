import react, { useEffect, useState, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Card from './homeComponent/Card';
import Styles from './css/home.module.css';
import {UserContext} from '../App';


const Home = ()=> {


    const navigate = useNavigate();
    const [EventsDetail, setEventsDetail] = useState([]);
    const {state, dispatch} = useContext(UserContext); 


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

    const getEvents = async () => {
      try {
        const result = await fetch('/getAllEventsDetailFromDB', {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });      
  
        const {eventsDetail}  = await result.json();
        // console.log(eventsDetail);
        for(let eventDetail of eventsDetail){
          setEventsDetail(oldVal => [...oldVal, {eventDetail}]);
          // console.log(eventDetail);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    useEffect(() => {
        checkIsUserAuthenticate();        
        getEvents();
    }, [])


    return (
        <div className="container-fluid mt-3">
          <div className={`row g-4 ${Styles.rowDiv}`}>
            {
              EventsDetail.map((val, i) => {
                let temp = val.eventDetail.eventDate.substr(0, 10);
                val.eventDetail.eventDate = temp;
                return <Card eventName={val.eventDetail.eventName} eventDate={val.eventDetail.eventDate} url={val.eventDetail.imageUrl} key={i} go_to={`/eventImages/${val.eventDetail.eventName}`} /> 
                })
            }
            </div>
        </div>
    )
}

export default Home;