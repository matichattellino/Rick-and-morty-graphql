import React, { useState, useEffect} from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import styles from './Episodes.module.css'
import Filter from '../Filter/Filter'
import Pagination from '../Pagination/Pagination'
import {  useHistory } from 'react-router-dom';
import Modal from 'react-modal'
import PropTypes from 'prop-types';

const Episodes = () => {
    const [ searchTerm, setSearchTermn ] = useState("");
    const [ episode, setEpisode ] = useState([]);
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ modalDisplay, setModalDisplay ] = useState("");

    const history = useHistory();
    const historyEpisode = history.location.pathname;

    const handleChange = e => {
            setSearchTermn(e.target.value);   
    };

    const onClear = () => {
        setSearchTermn("");
    }


    let query = gql`
        query($page:Int, $filter: FilterEpisode) {
        episodes(page:$page, filter:$filter){
            info{
            count
            pages
            next
            prev
            }
            results{
                id
                name
                episode
                air_date
                characters{
                name
              }
            }
        }
}
    `
    const { data, loading, error, fetchMore} = useQuery(query, {
        variables: { page: 1 },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network'
    });

    console.log(data);

    const episodesData = data ? data['episodes']['results'] : [];
    const { pages, next, prev, count } = data ? data['episodes']['info'] : {};
    

    const paginate = (data, fetchMore, page) =>
        fetchMore({
            variables: {
            page
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) return previousResult;
            
            return fetchMoreResult;
            }
           
    });
 
    const onPrev = () => paginate(data, fetchMore, prev);
    const onNext = () => paginate(data, fetchMore, next);
    
    if(searchTerm.length >= "3") {
        
    }

     useEffect(() => {     
            const results = episodesData.filter(episodes =>
                episodes.name.toString().toLowerCase().includes(searchTerm)
            );
                setEpisode(results);
            
     }, [data, searchTerm])
    

    if(loading || !data) return <h2>Cargando...</h2>
    return (  
        <>
        <div class={styles.grid}>
           <div className={styles.header}>
              Rick and Morty searcher
           </div>
           <div className={styles.sidebar}>
               <div className={styles.center}>
                   <Filter historyEpisode={historyEpisode} />
               </div>
           </div>
           <div className={styles.main}>
           <div class="container">
   <br/>
   <div class="row justify-content-center">
                       <div class="col-12 col-md-10 col-lg-8">
                           <form class="card card-sm" 
                                 //onSubmit={filter}
                           >
                               <div class="card-body row no-gutters align-items-center">
                                  
                                   <div class="col">   
                                       <input 
                                           class="form-control form-control-lg form-control-borderless" 
                                           type="text" 
                                           placeholder="Search topics or keywords" 
                                           value={searchTerm}
                                           onChange={handleChange}
                                       />
                                   </div>
                                   <div class="col-auto">
                                   <button 
                                       type="button" 
                                       class="close" aria-label="Close"
                                       onClick={onClear}
                                   >
                                       <span aria-hidden="true">&times;</span>
                                   </button>
                                   </div>
                               </div>
                           </form>
                       </div>
                   </div>
        </div>
           <div>
               <div class="col-12 p-5 row">
                   {episode.map(epis => (
                       <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                           <div class="card mt-1">
                           {epis.episode}
                               <div class="card-body text-center">
                                   <h5 class="card-title">
                                       
                                       {epis.name}
                                   </h5>
                                   <button 
                                        type="button" 
                                        style={{ width: "12rem"}} 
                                        class="btn btn-secondary btn-sm"
                                        onClick={() => {
                                                setModalIsOpen(true);
                                                setModalDisplay(epis);
                                        }}
                                    >
                                    Details
                                    </button>
                               </div>
                           </div>
                       </div>
                   ))
                   }
                    <Modal 
                        isOpen={modalIsOpen}
                        shouldCloseOnOverlayClick={false}
                        onRequestClose={() => setModalIsOpen(false)}
                        style={
                            {
                                overlay: {
                                   
                                },
                                content: {
                                    position: "center",
                                    height: "73vh",
                                    width: "60vh",
                                    color: "black",
                                    top: "20px",
                                    margin: "0 auto",
                                    border: '1px solid #ccc',
                                    background: '#eaece5',
                                    overflow: 'auto',
                                    WebkitOverflowScrolling: 'touch',
                                    borderRadius: '10px',
                                    outline: 'none',
                                    padding: '20px'
                                }
                            }
                        }
                    >
                        <div class="card">
                            <div class="list-group list-group-flush">
                                <li class="list-group-item">{modalDisplay.name}</li>
                                <li class="list-group-item">{modalDisplay.episode}</li>
                                <li class="list-group-item">{modalDisplay.air_date}</li>
                                <div>
                                    <li class="list-group-item">
                                    <p style={{textTransform: "uppercase", fontWeight: "bold"}}>Characters:</p>
                                    {
                                        modalDisplay ? 
                                        modalDisplay.characters.slice(0, 5).map(res => (
                                            <p>{res.name}</p>
                                        )) : <p></p>
                                    }
                                    </li>
                                </div>
                                <button class="btn btn-primary" onClick={() => setModalIsOpen(false)}>
                                Close
                                </button>
                            </div>
                        </div>
                    </Modal>
               </div>
               {episodesData && (
                  <Pagination prev={prev} next={next} onPrev={onPrev} onNext={onNext} pages={pages} />
               )}
               </div>   
           </div>
       </div>  
       </>
    )
}

Episodes.propTypes = {
    data: PropTypes.shape({
        episodes: PropTypes.shape({
            info: PropTypes.shape({
                count: PropTypes.number.isRequired,
                pages: PropTypes.number.isRequired,
                next: PropTypes.number.isRequired,
                prev: PropTypes.number.isRequired,
            }).isRequired,
            results: PropTypes.shape({
                name: PropTypes.string.isRequired,
                id: PropTypes.number.isRequired,
                episode: PropTypes.string.isRequired,
                air_date: PropTypes.string.isRequired,
                characters: PropTypes.shape({
                        name: PropTypes.string.isRequired
            }).isRequired,
            }).isRequired,
        }).isRequired
    }).isRequired   
};

 
export default Episodes;
