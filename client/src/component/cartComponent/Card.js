import React from 'react';
import Styles from './cart.module.css';

function Card(props) {



  return (
    <div className="col-md-3">
        <div className={`card ${Styles.carDiv}`}>
            <img src={props.url} className={`card-img-top ${Styles.img}`} alt={props.alt}/>
            <div className="card-body">
                <div className=''>
                    <button onClick={() => {props.removeFromCart(props.id)}} className='btn btn-primary'>Remove</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card