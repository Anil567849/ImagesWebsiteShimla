import React from 'react';
import Styles from './GoogleSignupButton.module.css';

function GoogleSignupButton({text, googleAuth}) {
  return (
            <button className={Styles.google_btn} onClick={googleAuth}>
                <img src="./images/icons/google.svg" alt="google icon" />
                <span>{text}</span>
            </button>
  )
}

export default GoogleSignupButton