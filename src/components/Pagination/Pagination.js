import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ( { next, prev, onNext, onPrev, pages}) => {
    const currentPage = () => {
        if (!prev && !next) return 1;
        return prev ? prev + 1 : next - 1;
      };
    return ( 
        <div className="row justify-content-center">
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    {prev && (
                        <li className="page-item" onClick={onPrev}><a className="page-link" href="#">{prev}</a></li>
                     )}     
                        <li className="page-item">
                            <a className="page-link" href="#">{`${currentPage()}/${pages}`}</a>
                        </li>
                    {
                    next && (
                        <li className="page-item" onClick={onNext}>
                            <a className="page-link" href="#">{next}</a>
                        </li>
                        )
                    } 
                </ul>
            </nav>
        </div>
     );
}

Pagination.propTypes = {
    pagination: PropTypes.shape({
        next: PropTypes.number.isRequired,
        prev: PropTypes.number.isRequired,
        pages: PropTypes.number.isRequired
    })
}
 
export default Pagination;