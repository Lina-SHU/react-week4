import PropTypes from 'prop-types';

function Pagination ({ pagination, handlePage, getProducts }) {

    const changePage = (e, page) => {
        e.preventDefault();
        getProducts(page);
    };

    return (
        <nav>
            <ul className="pagination">
            <li className={pagination?.has_pre ? 'page-item' : 'page-item disabled'} style={{ cursor:  pagination?.has_pre ? 'pointer' : 'not-allowed' }}>
                <a className="page-link" onClick={(e) => handlePage(e, 'prev')}>上一頁</a>
            </li>
            {
                pagination && new Array(pagination?.total_pages).fill(0).map((_, i) => i + 1).map((page) => {
                return (
                    <li key={page} className={pagination?.current_page === page ? 'page-item active' : 'page-item'}>
                    <a className="page-link" href="#" onClick={(e) => changePage(e, page)}>{page}</a>
                    </li>
                )
                })
            }
            <li className={pagination?.has_next ? 'page-item' : 'page-item disabled'} style={{ cursor:  pagination?.has_next ? 'pointer' : 'not-allowed' }}>
                <a className="page-link" href="#" onClick={(e) => handlePage(e, 'next')}>下一頁</a>
            </li>
            </ul>
        </nav>
    )
};

export default Pagination;

Pagination.propTypes = {
    pagination: PropTypes.object,
    handlePage: PropTypes.func,
    getProducts: PropTypes.func
};
