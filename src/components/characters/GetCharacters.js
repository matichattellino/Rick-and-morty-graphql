import React, { useState, useEffect} from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import styles from './Characters.module.css'
import Filter from '../Filter/Filter'
import Pagination from '../Pagination/Pagination'
import {  useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import PropTypes from 'prop-types';


const GetCharacters = ( { client }) => {
    const [ searchTerm, setSearchTermn ] = useState("");
    const [ chars, setChars ] = useState([]);
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ modalDisplay, setModalDisplay ] = useState("");


    const history = useHistory();
    const historyCharacter = history.location.pathname;


    const handleChange = e => {
            setSearchTermn(e.target.value);   
    };

    const onClear = () => { 
        setSearchTermn("");
    }


    let query = gql`
        query($page:Int, $filter: FilterCharacter) {
            characters(page:$page, filter: $filter){
                info{
                    count
                    pages
                    next
                    prev
                }
                results{
                    name
                    id
                    image
                    type
                   gender
                   species
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

    const characterData = data ? data['characters']['results'] : [];
    const { pages, next, prev, count } = data ? data['characters']['info'] : {};
    

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
        const results = !searchTerm || searchTerm.length <= 3 ? 
        characterData 
        : characterData.filter(characters =>
            characters.name.toString().toLowerCase().includes(searchTerm) ||
            characters.type.toString().toLowerCase().includes(searchTerm)
        );
       setChars(results);        
    }, [characterData, searchTerm])  
    

    if(loading || !data) return <h2>Cargando...</h2>


    return ( 
        <>
         <div className={styles.grid}>
            <div className={styles.header}>
               CHARACTERS
            </div>
            <div className={styles.sidebar}>
                <div className={styles.center}>
                    <Filter historyCharacter={historyCharacter} />
                </div>
            </div>
            <div className={styles.main}>
            <div className="container">
    <br/>
	<div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <form className="card card-sm" 
                                  //onSubmit={filter}
                            >
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
                    {chars.map((char) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={char.id}>
                            <div className="card mt-1">
                                <img className="card-img-top" src={char.image} alt="card image" />
                                <div className="card-body text-center">
                                    <h5 className="card-title">
                                        {char.name}
                                    </h5>
                                     <button    
                                            onClick={() => {
                                                setModalIsOpen(true);
                                                setModalDisplay(char);
                                            }}
                                            type="button" 
                                            style={{ width: "12rem"}} 
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                    <div className={styles.modal}>
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
                                    height: "90vh",
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
                            <div class="view overlay">
                                <img className="card-img-top" src={modalDisplay.image} alt="image" />
                            </div>
                            <div className="card-body">
                                <h4 className="card-title">
                                    {modalDisplay.name}
                                </h4>
                                <p className="card-text">
                                    {modalDisplay.type}
                                </p>
                                <p className="card-text">
                                    {modalDisplay.gender}
                                </p>
                                <p className="card-text">
                                    {modalDisplay.species}
                                </p>
                                <button className="btn btn-primary" onClick={() => setModalIsOpen(false)}>
                                Close
                                </button>
                            </div>
                        </div>
                    </Modal>
                    </div>
                </div>
                {characterData && (
                   <Pagination prev={prev} next={next} onPrev={onPrev} onNext={onNext} pages={pages} />
                )}
                </div>   
            </div>
        </div>  
        </>
     );
}

GetCharacters.propTypes = {
    data: PropTypes.shape({
        characters: PropTypes.shape({
            info: PropTypes.shape({
                count: PropTypes.number.isRequired,
                pages: PropTypes.number.isRequired,
                next:PropTypes.number.isRequired,
                prev:PropTypes.number.isRequired,
            }).isRequired,
            results: PropTypes.shape({
                name: PropTypes.string.isRequired,
                id: PropTypes.number.isRequired,
                image: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
               gender: PropTypes.string.isRequired,
               species: PropTypes.string.isRequired
            }).isRequired,
        }).isRequired
    }).isRequired
};



export default GetCharacters;