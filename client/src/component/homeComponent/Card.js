import React from 'react';
import {NavLink} from 'react-router-dom';
import Styles from '../css/home.module.css';

function Card(props) {

  // console.log(props);


  return (
    <NavLink to={props.go_to} className={`col-md-3 ${Styles.cardCss}`}>
      <div className={`card ${Styles.cardDiv}`}>
            <img src={props.url} className={`card-img-top ${Styles.img}`} alt="..."/>
            <div className="card-body">
                <h5 className={`card-title ${Styles.cardTitle}`}>{props.eventName}</h5>
                <h5 className={`card-title ${Styles.cardTitle}`}>{props.eventDate}</h5>
            </div>
      </div>
    </NavLink>
  )
}

export default Card