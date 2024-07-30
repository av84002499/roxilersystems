import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const fetchTransactions = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/list?page=${page}`);
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

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
            <button className="btn btn-warning">Select Month</button>
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
            {transactions.map(transaction => (
              <div className="column" key={transaction.id}>
                <div className="item">{transaction.id}</div>
                <div className="item">{transaction.title}</div>
                <div className="item">{transaction.description}</div>
                <div className="item">{transaction.price}</div>
                <div className="item">{transaction.category}</div>
                <div className="item">{transaction.sold ? 'Yes' : 'No'}</div>
                <div className="item">
                  <img src={transaction.image} alt={transaction.title} />
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div className='pagination'>
            <h4 className='page-info'>Page No: {page}</h4>
            <h4 className='page-action' onClick={handlePreviousPage} style={{ cursor: 'pointer' }}>Previous</h4>
            <h4 className='page-action' onClick={handleNextPage} style={{ cursor: 'pointer' }}>Next</h4>
            <h4 className='page-info'>Per Page : {/* Show per page info if needed */}</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
