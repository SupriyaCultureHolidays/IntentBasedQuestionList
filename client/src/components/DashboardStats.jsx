const DashboardStats = ({ stats }) => {
  return (
    <div style={styles.container} className="admin-stats-grid">
      <div style={styles.card} className="admin-card">
        <div style={styles.cardTitle}>Total Questions</div>
        <div style={styles.cardValue}>{stats.totalQuestions || 0}</div>
        <div style={styles.cardSubtext}>Questions with feedback</div>
      </div>
      <div style={styles.card} className="admin-card">
        <div style={styles.cardTitle}>Overall Approval Rate</div>
        <div style={styles.cardValue}>{stats.overallApprovalRate || 0}%</div>
        <div style={styles.cardSubtext}>Team consensus</div>
      </div>
      <div style={styles.card} className="admin-card">
        <div style={styles.cardTitle}>Chatbot-Ready</div>
        <div style={{...styles.cardValue, color: '#10b981'}}>{stats.chatbotReady || 0}</div>
        <div style={styles.cardSubtext}>Ready for implementation</div>
      </div>
      <div style={styles.card} className="admin-card">
        <div style={styles.cardTitle}>Pending Review</div>
        <div style={{...styles.cardValue, color: '#f59e0b'}}>{stats.pendingReview || 0}</div>
        <div style={styles.cardSubtext}>Need more feedback</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '1px solid #e0e0e0'
  },
  cardTitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px'
  },
  cardSubtext: {
    fontSize: '12px',
    color: '#999'
  }
};

export default DashboardStats;