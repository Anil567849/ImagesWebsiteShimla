import { createContext, useReducer, useState, useEffect } from 'react';
import './App.css';
import Signup from './component/Signup';
import {Routes, Route} from 'react-router-dom';
import Home from './component/Home';
import {initialState, reducer} from './reducer/UserReducer';
import Login from './component/Login';
import UploadImages from './component/admin/UploadImages';
import EventImages from './component/EventImages';
import Cart from './component/Cart';
import Download from './component/Download';
import Header from './component/Header';
import Cookies from 'js-cookie';
export const UserContext = createContext();


function App() {
  let [state, dispatch] = useReducer(reducer, initialState);
  // console.log(state);
  return (
    <div className="App"> 
    <UserContext.Provider value={{state, dispatch}}>

     { state && <Header/> }
      <Routes>
        <Route exact path="/" element={<Home/>}>  </Route>
        <Route exact path="/eventImages/:eventName"  element={<EventImages />}>  </Route>
        <Route exact path="/upload" element={<UploadImages/>}>  </Route>
        <Route exact path="/download/:payId" element={<Download/>}>  </Route>
        <Route exact path="/download" element={<Download/>}>  </Route>
        <Route exact path="/cart" element={<Cart/>}>  </Route>
        <Route exact path="/signup" element={<Signup />}>  </Route>
        <Route exact path="/login" element={<Login />}>  </Route>
      </Routes>
    </UserContext.Provider>     
    </div>
  );
}


export default App;
