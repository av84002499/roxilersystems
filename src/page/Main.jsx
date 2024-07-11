import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const App = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
      .then(response => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching the transactions data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleNextPage = () => {
    if (page < Math.ceil(transactions.length / itemsPerPage)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const displayedTransactions = transactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <>
      <div className="card">
        <div className="main-page">
          <div className="header">
            <div className="sphere">
              <h1>Transaction Dashboard</h1>
            </div>
          </div>
          <div className="buttons">
            <button className="btn btn-warning">Search Transaction</button>
            <props.Button className="btn btn-warning">Select Month</props.Button>
          </div>
          <hr />
          <div className="container">
            <div className="column header">
              <div className="item">ID</div>
              <div className="item">Title</div>
              <div className="item">Description</div>
              <div className="item">Price</div>
              <div className="item">Category</div>
              <div className="item">Sold</div>
              <div className="item">Image</div>
            </div>
            {displayedTransactions.map(transaction => (
              <div className="column" key={transaction.id}>
                <div className="item">{transaction.id}</div>
                <div className="item">{transaction.title}</div>
                <div className="item">{transaction.description}</div>
                <div className="item">${transaction.price}</div>
                <div className="item">{transaction.category}</div>
                <div className="item">{transaction.sold ? 'Yes' : 'No'}</div>
                <div className="item"><img src={transaction.image} alt={transaction.title} /></div>
              </div>
            ))}
          </div>
          <hr />
          <div className='pagination'>
            <h4 className='page-info'>Page No: {page}</h4>
            <h4 className='page-action' onClick={handlePreviousPage} style={{ cursor: 'pointer' }}>Previous</h4>
            <h4 className='page-action' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Next</h4>
            <h4 className='page-info'>Per Page : {itemsPerPage}</h4>
          </div>
        </div>
      </div>
    </>
  );
}

App.propTypes = {
  Button: PropTypes.elementType.isRequired
};

export default App;
