import React from 'react';
import styles from './Layout.module.css'
import Filter from '../Filter/Filter'

const Layout = ( { children, title }) => {
    return ( 
        <>
            <div className={styles.grid}>
                <div className={styles.header}>
                    {title}
                </div>
                <div className={styles.sidebar}>
                    <div className={styles.center}>
                        <Filter />
                    </div>
                </div>
                <div className={styles.main}>
                    {children}
                </div>
            </div>
        </>
     );
}
 
export default Layout;