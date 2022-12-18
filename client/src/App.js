import { createContext, useReducer, useState, useEffect } from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import {initialState, reducer} from './reducer/UserReducer';
import Cookies from 'js-cookie';


import Header from './component/headerComponent/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import UploadImages from './component/admin/UploadImages';
import EventImages from './pages/EventImages';
import Cart from './pages/Cart';
import Download from './pages/Download';

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
