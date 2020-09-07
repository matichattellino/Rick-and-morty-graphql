import React, { useState } from 'react';
import styles from './Filter.module.css';
import { Link, BrowserRouter } from 'react-router-dom';

const Filter = ( { historyCharacter, historyEpisode, historyLocation }) => {

    return ( 
        <div>
            <div>
                <Link to="/">
                    <button
                        className={historyCharacter === "/" ? styles.button : styles.disabled}   
                    >Characters</button>
                </Link>
                <Link to="/locations">
                    <button 
                     className={historyLocation === "/locations" ? styles.button : styles.disabled}
                    >Locations</button>
                 </Link>
                 <Link to="/episodes">
                    <button 
                        className={historyEpisode === "/episodes" ? styles.button : styles.disabled} 
                    >Episodes</button>
                </Link>
            </div>
         </div>
    );
}
 
export default Filter;