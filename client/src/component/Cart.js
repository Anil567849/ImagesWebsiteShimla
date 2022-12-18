    import React, { useState, useEffect, useRef, useContext} from 'react'
    import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
    import Cookies from 'js-cookie';
    import Card from './cartComponent/Card';
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import Styles from './css/cart.module.css';
    import {UserContext} from '../App';

    function Cart() {

        const userId = Cookies.get('userId'); // userId
        const [images, setImages] = useState([]);
        const searchQuery = useSearchParams()[0];
        const payId = searchQuery.get("reference");
        const navigate = useNavigate();
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



        const download = async () => {

                try {
                    
                    const result = await fetch('/getAllCartItemsKeyFromDB', {
                        method : "POST",
                        headers : {
                            Accept : 'application/json',
                            'Content-Type' : 'application/json',
                        },
                        body : JSON.stringify({
                            'userId' : userId
                        })
                    })
            
                    const imagesKey = await result.json();
                    // console.log(keys);
                    const res = await fetch('/downloadFiles', {
                        method : "POST",
                        headers : {
                            Accept : 'application/json',
                            "Content-Type" : "application/json",
                        },
                        body : JSON.stringify({
                            imagesKey,
                            payId,
                        })
                    })
                    const {downloaded} = await res.json();
                    // console.log(downloaded);         
                    if(downloaded){
                        
                        const lastAccessTime = Date.now() + 86400 * 1000 * 2; // 2 days after
                        // store payment id in db;
                        const r = await fetch('/storePaymentIdInDB', {
                            method : "POST",
                            headers : {
                                Accept : 'application/json',
                                "Content-Type" : "application/json",
                            },
                            body : JSON.stringify({
                                userId,
                                payId,
                                lastAccessTime,
                            })
                        })

                        const {saved} = await r.json();

                        if(saved){

                            // clear Cart 
                            try {
                                const clear = await fetch('/clearCartFromDB', {
                                    method : "POST",
                                    headers : {
                                        Accept : 'application/json',
                                        "Content-Type" : "application/json",
                                    },
                                    body : JSON.stringify({
                                        userId,
                                    })
                                })

                                await clear.json();
                                
                            } catch (error) {
                                console.log(error);
                            }finally{
                                navigate(`/download/${payId}`);
                            }

                        }
                    }
                    
                } catch (error) {
                    console.log(error);
                }
                        
        }
        
        const isPaymentVerified = async () => {

            if(payId){

                try{

                    const id = await fetch('/getPaymentIdFromDb', {
                        method : "POST",
                        headers : {
                            Accept : 'application/json',
                            'Content-Type' : 'application/json',
                        },
                        body : JSON.stringify({
                            payId
                        })
                    })

                    const {found} = await id.json();
                    
                    if(found){                    
                        download();                
                    }else{
                        console.log('Invalid Payment Id');
                    }

                }catch(err){
                    console.log(err);
                }

            }

    
        }

        const getAllCartItems = async () => {

            try {
                
                const result = await fetch('/getAllCartItemsFromDB', {
                    method : "POST",
                    headers : {
                        Accept : 'application/json',
                        'Content-Type' : 'application/json',
                    },
                    body : JSON.stringify({
                        'userId' : userId
                    })
                })
        
                const data = await result.json();
                // console.log(data);
                data.forEach((val) => {
                    const cartImgId = val._id;
                    const imgId = val.images.imageId; 
                    const imgKey = val.images.imageKey; 
                    const imgUrl = val.images.imageUrl; 
                    const imgPreSignedUrl = val.images.imagePreSignedUrl;
                    // console.log(imgId, imgUrl);
                    setImages(oldVal => [...oldVal, {imgId, imgKey, imgUrl, imgPreSignedUrl, cartImgId}]);
                })

                

                
                
            } catch (error) {
                console.log(error);
            }
        
        
        }
        
        useEffect(() => {
            checkIsUserAuthenticate();
            getAllCartItems();
            isPaymentVerified();
        }, []);

        // CSS 
        const imagesCss = {
            height : "90%",
            width : "100%",
            display : 'block',
        }

        const checkout = async() => {

            try{
                const result = await fetch('/checkout', {
                    method : "POST",
                    headers : {
                        Accept : 'application/json',
                        'Content-Type' : "application/json",
                    },
                    body : JSON.stringify({
                        'amount' : Number(images.length) * 10,
                    })
                })

                const {payment} = await result.json();
                // console.log(payment);

                const k = await fetch('/getKey', {
                    method : "GET",
                    headers : {
                        'Content-Type' : "application/json",
                        Accept : 'application/json',
                    }
                })

                const {key} = await k.json();

                const options = {
                    key: key, // Enter the Key ID generated from the Dashboard
                    amount: payment.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    currency: "INR",
                    name: "Anil Kumar LTD",
                    description: "Test Transaction",
                    image: "https://media-exp1.licdn.com/dms/image/C4D03AQHHm0hHj4LGcA/profile-displayphoto-shrink_200_200/0/1651641137868?e=1675900800&v=beta&t=K2UePy6MoX4iyhhYy8vuoWoZbou7okjiI-5jwwvW4jk",
                    order_id: payment.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    callback_url: "http://localhost:3000/paymentVerification",
                    prefill: {
                        // logged in user details
                        name: "Gaurav Kumar",
                        email: "gaurav.kumar@example.com",
                        contact: "9999999999"
                    },
                    notes: {
                        address: "Razorpay Corporate Office"
                    },
                    theme: {
                        "color": "#3399cc"
                    }
                };


                var razor = new window.Razorpay(options);
                razor.open();




            }catch(err){
                console.log(err);
            }

        }

        const removeItem = () => {
            toast.success('Item Removed', {
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

        const removeFromCart = async (cartImgId) => {

        
            try {   
                const result = await fetch('/removeCartItemFromDB', {
                    method : 'POST',
                    headers : {
                        Accept : 'application/json',
                        'Content-Type' : 'application/json'
                    },  
                    body : JSON.stringify({cartImgId})
                })

                const del = await result.json();
                console.log(del);
                if(del.deletedCount == 1){
                    setImages((oldImages) => {
                        return images.filter( (arrElement, index) => {
                            return arrElement.cartImgId !== cartImgId;
                        });
                    })
                    removeItem();
                }else{
                    console.log('item not remove - error');
                }

            } catch (error) {
                
            }
        
        }





    return (
        <div className='container-fluid'>
            <h1 className={Styles.heading}>Order Summary</h1>

            <div className={`row ${Styles.summary}`}>
                <div className="col-md-6 d-flex justify-content-center">
                    <NavLink to="/" className="btn btn-primary m-5">Add More Images</NavLink>
                </div>
                <div className="col-md-6 border">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Total Items</th>
                                <th scope="col">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{images.length}</td>
                                <td>₹{Number(images.length) * 10}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='text-center'>
                        <button onClick={checkout} className='btn btn-warning mb-2' center>Proceed to Buy</button>
                    </div>
                </div>
            </div>

            <h1 className={Styles.heading}>Your Items</h1>
            <div className={`row g-4 ${Styles.rowDiv}`}>
            { 
                images.map((val, i) => {
                return (                
                        <Card key={i} removeFromCart={removeFromCart} id={val.cartImgId} url={val.imgUrl}/>
                    )
                })
            }
            </div>

            <ToastContainer />
        </div>
        )
    }

    export default Cart;    