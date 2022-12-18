import React from 'react';
import Styles from './download.module.css';

function Card(props) {
  return (
            <div className="col-sm-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title m-2">{props.fileName}</h5>
                        <p className="card-text m-2">{props.date}</p>
                        <a href={props.go_to} className={Styles.download_btn} >
                            <img src="/images/icons/download.png" alt="download icon" />
                            <span>Download</span>
                        </a>
                    </div>
                </div>
            </div>
  )
}

export default Card