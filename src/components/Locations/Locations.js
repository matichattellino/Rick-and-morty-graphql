import React, { useState, useEffect} from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import styles from './Locations.module.css'
import Pagination from '../Pagination/Pagination'
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import Layout from '../Layout/Layout';


const Locations = ( { client }) => {
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ locations, setLocations ] = useState([]);
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ modalDisplay, setModalDisplay ] = useState("");

    const handleChange = e => setSearchTerm(e.target.value);

    const onClear = () => setSearchTerm("");

    let query = gql`
      query($page:Int, $filter: FilterLocation) {
        locations(page:$page, filter:$filter){
            info{
                count
                pages
                next
                prev
        }
        results{
            name
            dimension
            type
            residents {
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

    const locationData = data ? data['locations']['results'] : [];
    const { pages, next, prev, count } = data ? data['locations']['info'] : {};
    

    const paginate = (data, fetchMore, page) =>
        fetchMore({
            variables: {
            page
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) return previousResult;
            
            return fetchMoreResult;//[...previousResult, ...fetchMoreResult]
            }
           
    });
 
    const onPrev = () => paginate(data, fetchMore, prev);
    const onNext = () => paginate(data, fetchMore, next);
    
    if(searchTerm.length >= "3") {
        
    }

     useEffect(() => {  
        const locationFilter = locationData.filter(location =>
            location.name.toString().toLowerCase().includes(searchTerm) ||
            location.type.toString().toLowerCase().includes(searchTerm)
        );
        let results; 
        
        if( !searchTerm || searchTerm.length <= 3) {
            results = locationData;
        } else {
            results = locationFilter;
        }
        setLocations(results);    
     }, [locationData, searchTerm])

     if(loading || !data) return <h2>Cargando...</h2>

    return ( 
        <Layout title="LOCATIONS">
                <div className="container">
                        <br/>
                        <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-8">
                                    <form className="card card-sm">
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
                        {locations.map(loc => (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card mt-1">
                                        {loc.name}
                                    <div className="card-body text-center">
                                        <h5 className="card-title">
                                        {loc.dimension}
                                        </h5>
                                        <button type="button" 
                                            className="btn btn-secondary btn-sm btn-lg"
                                            onClick={() => {
                                                    setModalIsOpen(true);
                                                    setModalDisplay(loc);
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
                                    <li className="list-group-item">{modalDisplay.dimension}</li>
                                    <li className="list-group-item">{modalDisplay.type}</li>
                                    <div>
                                        <li className="list-group-item">
                                        <p className={styles.title}>Residents:</p>
                                        {
                                            modalDisplay && modalDisplay.residents.slice(0, 5).map(res => (
                                                <p>{res.name}</p>
                                            ))
                                        }
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
                        {locationData && (
                        <Pagination prev={prev} next={next} onPrev={onPrev} onNext={onNext} pages={pages} />
                        )}
       </Layout>
     );
}

Locations.propTypes = {
    data: PropTypes.shape({
        locations: PropTypes.shape({
            info: PropTypes.shape({
                count: PropTypes.number.isRequired,
                pages: PropTypes.number.isRequired,
                next:PropTypes.number.isRequired,
                prev:PropTypes.number.isRequired,
            }).isRequired,
            results: PropTypes.shape({
                name: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                gender: PropTypes.string.isRequired,
                residents: PropTypes.shape({
                    name: PropTypes.string.isRequired
                 }).isRequired,
            }).isRequired,
        }).isRequired
    }).isRequired
};



export default Locations;