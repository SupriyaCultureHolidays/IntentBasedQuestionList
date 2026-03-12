const AdminTable = ({ feedbacks, currentPage, onPageChange }) => {
  const itemsPerPage = 20;
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

  const exportToCSV = () => {
    const headers = ['User Name', 'User Email', 'Intent', 'Question Text', 'Decision', 'Edited Text', 'Submitted At'];
    const rows = feedbacks.map(f => [
      f.userName,
      f.userEmail,
      f.intent,
      f.questionText,
      f.decision,
      f.editedText,
      new Date(f.submittedAt).toLocaleString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faq-feedbacks-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <div style={styles.info}>
          Showing {startIndex + 1}-{Math.min(endIndex, feedbacks.length)} of {feedbacks.length} feedbacks
        </div>
        <button onClick={exportToCSV} style={styles.exportBtn}>
          Export to CSV
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User Name</th>
              <th style={styles.th}>User Email</th>
              <th style={styles.th}>Intent</th>
              <th style={styles.th}>Question Text</th>
              <th style={styles.th}>Decision</th>
              <th style={styles.th}>Edited Text</th>
              <th style={styles.th}>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedbacks.map(f => (
              <tr key={f._id} style={styles.tr}>
                <td style={styles.td}>{f.userName}</td>
                <td style={styles.td}>{f.userEmail}</td>
                <td style={styles.td}>{f.intent}</td>
                <td style={styles.td}>{f.questionText}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    ...(f.decision === 'approved' ? styles.badgeApproved : styles.badgeRejected)
                  }}>
                    {f.decision}
                  </span>
                </td>
                <td style={styles.td}>{f.editedText || '-'}</td>
                <td style={styles.td}>{new Date(f.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={styles.pageBtn}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  info: {
    color: '#666',
    fontSize: '14px'
  },
  exportBtn: {
    padding: '8px 16px',
    background: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    background: '#f5f5f5',
    borderBottom: '2px solid #ddd',
    fontWeight: '600',
    color: '#333'
  },
  tr: {
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '12px',
    color: '#555'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  badgeApproved: {
    background: '#e8f5e9',
    color: '#4caf50'
  },
  badgeRejected: {
    background: '#ffebee',
    color: '#f44336'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '20px'
  },
  pageBtn: {
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  pageInfo: {
    color: '#666'
  }
};

export default AdminTable;
