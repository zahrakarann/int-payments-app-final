import React from 'react';
import './Component.css';

const getStatusBadge = (status) => {
  if (!status) return status;

  switch (status.toLowerCase()) {
    case 'pending':
      return <span className="badge badge-pending">Pending</span>;
    case 'verified':
      return <span className="badge badge-verified">Verified</span>;
    case 'submitted':
      return <span className="badge badge-submitted">Submitted</span>;
    default:
      return <span className="badge">{status}</span>;
  }
};

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  className = ''
}) => {
  const tableClass = `table-container ${className}`;

  if (loading) {
    return (
      <div className={tableClass}>
        <table className="table">
          <thead className="table-header">
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                {columns.map((col, i) => (
                  <td key={i}>
                    <div className="table-loading" style={{ height: '20px', borderRadius: '4px' }}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={tableClass}>
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="table-empty">
                  <div className="table-empty-icon">📊</div>
                  <h3>{emptyMessage}</h3>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'clickable-row' : ''}
              >
                {columns.map((col, i) => {
                  const cellValue = row[col.toLowerCase()];
                  
                  // Handle status
                  if (col.toLowerCase() === 'status') return <td key={i}>{getStatusBadge(cellValue)}</td>;

                  return <td key={i}>{cellValue}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
