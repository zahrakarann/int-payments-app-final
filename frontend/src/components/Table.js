import React from 'react';
import './Component.css';

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
                {columns.map((col, i) => (
                  <td key={i}>{row[col.toLowerCase()] || row[col]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;