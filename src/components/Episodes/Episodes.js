import React, { useState, useEffect} from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import styles from './Episodes.module.css'
import Pagination from '../Pagination/Pagination'
import Modal from 'react-modal'
import PropTypes from 'prop-types';
import Layout from '../Layout/Layout';

const Episodes = () => {
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ episode, setEpisode ] = useState([]);
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ modalDisplay, setModalDisplay ] = useState("");

    const handleChange = e => setSearchTerm(e.target.value);

    const onClear = () => setSearchTerm("");
    
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
                image
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
    
     useEffect(() => {   
        const episodeFilter = episodesData.filter(episode =>
            episode.name.toString().toLowerCase().includes(searchTerm)
        );
        let results; 
        
        if(!searchTerm || searchTerm.length <= 3) {
            results = episodesData;
        } else {
            results = episodeFilter;
        }  
        setEpisode(results);  
     }, [episodesData, searchTerm])

     if(loading || !data) return <h2>Cargando...</h2>
    
    return (  
        <Layout title="EPISODES">
             <div className="container">
                <br/>
                <div className="row justify-content-center">
                       <div className="col-12 col-md-10 col-lg-8">
                           <form class="card card-sm" >
                               <div className="card-body row no-gutters align-items-center">
                                  
                                   <div className="col">   
                                       <input 
                                           className="form-control form-control-lg form-control-borderless" 
                                           type="text" 
                                           placeholder="Search topics or keywords" 
                                           value={searchTerm}
                                           onChange={handleChange}
                                       />
                                   </div>
                                   <div className="col-auto">
                                   <button 
                                       type="button" 
                                       className="close" aria-label="Close"
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
               <div className="col-12 p-5 row">
                   {episode.map(epis => (
                       <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                           <div className="card mt-1">
                           {epis.episode}
                               <div className="card-body text-center">
                                   <h5 className="card-title">
                                       {epis.name}
                                   </h5>
                                   <button 
                                        type="button"
                                        
                                        className="btn btn-secondary btn-lg"
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
                        <div className="card">
                            <div className="list-group list-group-flush">
                                <li className="list-group-item">{modalDisplay.name}</li>
                                <li className="list-group-item">{modalDisplay.episode}</li>
                                <li className="list-group-item">{modalDisplay.air_date}</li>
                                <div>
                                    <li className="list-group-item">
                                        <p className={styles.text}>Characters:</p>
                                        <div className="container">
                                            <div className="row">
                                            {
                                                modalDisplay &&
                                                modalDisplay.characters.slice(0, 5).map(res => (
                                                <div className="col-lg-3 p-0 m-1">
                                                    <img style={{ height: 80, width: 80}} src={res.image} alt="Imagen" />
                                                    <p>{res.name}</p>        
                                                </div>
                                                ))
                                            }
                                            </div>
                                        </div>
                                    </li>
                                </div>
                                    <button className="btn btn-primary" onClick={() => setModalIsOpen(false)}>
                                        Close
                                    </button>
                            </div>
                        </div>      
                    </Modal>
                </div>
                </div>
                    {episodesData && (
                        <Pagination prev={prev} next={next} onPrev={onPrev} onNext={onNext} pages={pages} />
                    )}
        </Layout>
    )}

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
