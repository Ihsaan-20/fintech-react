import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactPaginate from 'react-paginate';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



import Papa from 'papaparse';
import { FaPrint, FaDownload, FaFilter, FaSort, FaExclamationCircle, FaHistory, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
const Transaction = () => {
  const { user, signout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [transactionCount, setTransactionCount] = useState(0);
  const [currentMonthWithYear, setCurrentMonthWithYear] = useState('');
  const componentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token || !user) {
          setError('Please log in to view transactions.');
          return;
        }

        const res = await fetch('http://localhost:8080/api/v1/user/current-month', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch transactions');

        // Destructure backend response
        const { count, currentMonthWithYear, transactions } = data.data;
        setTransactions(transactions || []);
        setCurrentMonthWithYear(currentMonthWithYear || '');
        setTransactionCount(count || 0);

      } catch (err) {
        setError(err.message || 'Failed to load transactions. Please try again later.');
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  const filteredTransactions = transactions
    .filter((t) =>
      filter
        ? (t.receiver?.toLowerCase().includes(filter.toLowerCase()) ||
          t.bank?.toLowerCase().includes(filter.toLowerCase()) ||
          t.status?.toLowerCase().includes(filter.toLowerCase()))
        : true
    )
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (sortField === 'amount') {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      return sortOrder === 'asc'
        ? (fieldA || '').toString().localeCompare((fieldB || '').toString())
        : (fieldB || '').toString().localeCompare((fieldA || '').toString());
    });

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentItems = filteredTransactions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Transaction_History_${user?.name || 'User'}`,
    pageStyle: `
      @media print {
        html, body { height: 100vh; margin: 0 !important; padding: 0 !important; }
        .no-print { display: none; }
      }
    `,
  });

  // const handleExportPDF = () => {
  //   const pdf = new jsPDF();
  //   pdf.text(`Transaction History for ${user?.name || 'User'}`, 20, 20);
  //   filteredTransactions.forEach((t, index) => {
  //     const yPos = 30 + index * 10;
  //     pdf.text(
  //       `ID: ${t.transactionId}, Date: ${t.timestamp}, Receiver: ${t.receiverName}, Amount: ₹${t.amount}, Type: ${t.transactionType}, Bank: ${t.bank}, Status: ${t.status}`,
  //       20,
  //       yPos
  //     );
  //   });
  //   pdf.save(`transactions_${user?.name || 'user'}.pdf`);
  // };
  const handleExportPDF = () => {
  const pdf = new jsPDF();

  pdf.text(`Transaction History for ${user?.name || 'User'}`, 14, 20);

  const tableColumn = ["Transaction ID", "Date", "Transaction", "Amount", "Type", "Status"];
  const tableRows = [];

  filteredTransactions.forEach(t => {
    const transactionData = [
      t.transactionId,
      new Date(t.timestamp).toLocaleString(),
       t.senderId === user.id ? 'Out' : 'In',
      `${t.amount}`,
      t.transactionType,
      t.status
    ];
    tableRows.push(transactionData);
  });

  autoTable(pdf, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });

  pdf.save(`transactions_${user?.name || 'user'}.pdf`);
};
//end here


  const handleExportCSV = () => {
    try {
      const csv = Papa.unparse(filteredTransactions);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `transactions_${user?.name || 'user'}.csv`;
      link.click();
    } catch (err) {
      setError('Failed to export CSV. Please try again.');
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 0',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '900px' }}>
        <div
          className="card border-0 shadow-lg"
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="text-center flex-grow-1">
                <h3 className="mb-2 d-flex align-items-center justify-content-center">
                  <span className="me-3" style={{ fontSize: '1.5rem', color: '#667eea' }}>
                    <FaHistory />
                  </span>
                  Transaction History
                </h3>
                <p className="text-muted mb-0">
                  View and manage your transaction records
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn"
                  style={{
                    borderRadius: '10px',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                  aria-label="Go back to dashboard"
                >
                  <FaArrowLeft className="me-2" />
                  Go Back
                </button>
                <button
                  onClick={signout}
                  className="btn"
                  style={{
                    borderRadius: '10px',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                  aria-label="Sign out"
                >
                  <FaSignOutAlt className="me-2" />
                  Sign Out
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div
                className="text-danger mb-4"
                style={{
                  background: 'rgba(255, 0, 0, 0.1)',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}
              >
                <FaExclamationCircle className="me-2" />
                {error}
              </div>
            ) : transactions.length === 0 ? (
              <div
                className="text-muted mb-4"
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}
              >
                No transactions found.
              </div>
            ) : (
              <>
                <div className="mb-3 text-center">
                  <h5>
                    {currentMonthWithYear ? `Transactions for ${currentMonthWithYear}` : 'Transactions'}
                  </h5>
                  <p>Total Transactions: {transactionCount}</p>
                </div>

                <div className="d-flex justify-content-between mb-4">
                  <div className="input-group" style={{ maxWidth: '300px' }}>
                    <span className="input-group-text">
                      <FaFilter />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter by receiver, bank, or status"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      style={{
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </div>
                  <div className="d-flex gap-2 no-print">
                    <button className="btn" onClick={handlePrint}>
                      <FaPrint className="me-2" /> Print
                    </button>
                    <button className="btn" onClick={handleExportPDF}>
                      <FaDownload className="me-2" /> Export PDF
                    </button>
                    <button className="btn" onClick={handleExportCSV}>
                      <FaDownload className="me-2" /> Export CSV
                    </button>
                  </div>
                </div>

                <div ref={componentRef}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                          ID <FaSort className="ms-1" />
                        </th>
                        <th>
                          Date 
                        </th>
                        {/* <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                          Date <FaSort className="ms-1" />
                        </th> */}
                        <th>Transaction</th>
                        <th>
                          Amount 
                        </th>
                        <th>
                          Balance 
                        </th>
                        <th>
                          Type 
                        </th>
                        <th>
                          Status 
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((t) => (
                        <tr key={t.id}>
                          <td>{t.transactionId}</td>
                          <td>{new Date(t.timestamp).toLocaleString()}</td>
                          <td
                            style={{
                              color: t.senderId === user.id ? 'red' : 'green',
                              fontWeight: 'bold'
                            }}
                          >
                            {t.senderId === user.id ? 'Out' : 'In'}
                          </td>
                          <td>${t.amount}</td>
                          <td>${t.balanceAfterTransaction}</td>
                          <td>{t.transactionType}</td>
                          <td>
                            <span
                              className={`badge ${
                                t.status === 'Completed' ? 'bg-success' : 'bg-warning'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pageCount > 1 && (
                  <div className="d-flex justify-content-center mt-4 no-print">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="Next >"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="< Previous"
                      renderOnZeroPageCount={null}
                      containerClassName="pagination"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      activeClassName="active"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div
          className="card border-0 mt-4 no-print"
          style={{
            borderRadius: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="card-body p-3 text-center">
            <p className="text-white mb-0" style={{ fontSize: '0.9rem', opacity: '0.8' }}>
              🔒 Your transaction data is secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .pagination {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
        }
        .page-item {
          margin: 0 5px;
        }
        .page-link {
          display: block;
          padding: 8px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.8);
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .page-link:hover {
          background: rgba(255, 255, 255, 1);
        }
        .active .page-link {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }
        .table {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
        }
        .table th, .table td {
          padding: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .table th {
          background: rgba(255, 255, 255, 0.9);
        }
        .badge {
          padding: 6px 12px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default Transaction;
