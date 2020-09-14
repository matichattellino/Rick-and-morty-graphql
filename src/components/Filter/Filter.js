import React, { useState } from 'react';
import styles from './Filter.module.css';
import { Link, BrowserRouter } from 'react-router-dom';

import {  useHistory } from 'react-router-dom';

const Filter = () => {
    const history = useHistory();
    const filterHistory = history.location.pathname;

    return ( 
        <div>
            <div>
                <Link to="/">
                    <button
                        className={filterHistory === "/" ? styles.button : styles.disabled}   
                    >Characters</button>
                </Link>
                <Link to="/locations">
                    <button 
                     className={filterHistory === "/locations" ? styles.button : styles.disabled}
                    >Locations</button>
                 </Link>
                 <Link to="/episodes">
                    <button 
                        className={filterHistory === "/episodes" ? styles.button : styles.disabled} 
                    >Episodes</button>
                </Link>
            </div>
         </div>
    );
}
 
export default Filter;