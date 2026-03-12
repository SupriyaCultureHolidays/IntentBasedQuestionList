import AdvancedPagination from './AdvancedPagination';

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
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  info: {
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500'
  },
  exportBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  th: {
    padding: '16px 12px',
    textAlign: 'left',
    background: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '14px',
    letterSpacing: '-0.1px'
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease'
  },
  td: {
    padding: '16px 12px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.4'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  badgeApproved: {
    background: '#d1fae5',
    color: '#065f46'
  },
  badgeRejected: {
    background: '#fee2e2',
    color: '#991b1b'
  }
};

export default AdminTable;
