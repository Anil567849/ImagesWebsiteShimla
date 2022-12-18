import React from 'react';
import {NavLink} from 'react-router-dom';
import Styles from './eventImages.module.css';
function Card(props) {



  return (
    <div className="col-md-3">
        <div className={`card ${Styles.cardDiv}`}>
            <img src={props.url} className={`card-img-top ${Styles.img}`}alt={props.alt}/>
            <div className="card-body">
                <div className={`${Styles.rateDiv}`}>
                    <h5>₹10</h5>
                    <button onClick={() => {props.addToCart(props.val)}} className={Styles.addToCart_btn} >
                            <img src="/images/icons/cart.png" alt="cart icon" />
                            <span>Add To Cart</span>
                        </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card