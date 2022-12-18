import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../component/eventImagesComponent/Card';
import Styles from '../component/eventImagesComponent//eventImages.module.css';

const EventImages = () => {
    
    const {eventName} = useParams();
    const [images, setImages] = useState([]);

    const getAllImgesFromDB = async () => {

        try{
            const result = await fetch("/getAllImagesFromDB", {
                method : 'POST', 
                headers : {
                    Accept: "application/json",
                    'Content-Type' : 'application/json', 
                },
                body : JSON.stringify({"eventName" : eventName})
            });

            const {allImages} = await result.json();
            // console.log(allImages);

            allImages.forEach((ele) => {
                const id = ele._id;
                const key = ele.key;
                let url = ele.url;
                url = url.substr(0, url.indexOf('?'));
                const preSignedUrl = ele.url;
                setImages((oldVal) => [...oldVal, {id, key, url, preSignedUrl}]);
            })
        }catch(err){
            console.log('eventImages.js ', err);
        }
    }
    
    useEffect(() => {
        getAllImgesFromDB();
    }, []);


    // ADD TO CART 
    const userId = Cookies.get('userId'); // userId
    // console.log(userId);
    const addToCart = async (val) => {

        const imageId = val.id;
        const imageKey = val.key;
        const imageUrl = val.url;
        const imagePreSignedUrl = val.preSignedUrl;
        // console.log(imageId, imageUrl);
        try{
            const result = await fetch('/addImagesInCartInDB', {
                method : "POST",
                headers : {
                    Accept : 'application/json',
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({userId, imageId, imageKey, imageUrl, imagePreSignedUrl})
            })

            const data = await result.json();
            // console.log(data);
            if(data){
                itemSaved();
            }
        }catch(er){
            console.log('err eventimages.js', er);
        }

    }

    const itemSaved = () => {
        toast.success('Item Added', {
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

    return (
        <div className="border">
            <h1 className={Styles.heading}>{eventName}</h1>
                <div className={`row g-4 ${Styles.rowDiv}`}>
                {
                    images.map((val, i) => {
                    return (
                            <Card val={val} addToCart={addToCart} key={i} url={val.url} alt={val.key}/>
                        )
                    })
                }
                </div>
            <ToastContainer />
        </div>
    )
}
export default EventImages