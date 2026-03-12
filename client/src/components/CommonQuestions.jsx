const CommonQuestions = ({ questions, onExportChatbotReady }) => {
  const getStatusStyle = (status) => {
    if (status === 'Ready for Chatbot') return { background: '#e8f5e9', color: '#4caf50' };
    if (status === 'Good Consensus') return { background: '#e3f2fd', color: '#2196f3' };
    if (status.includes('Conflict')) return { background: '#fff3e0', color: '#ff9800' };
    return { background: '#f5f5f5', color: '#666' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Most Common Questions</h3>
        <button onClick={onExportChatbotReady} style={styles.exportBtn}>
          Export Chatbot-Ready
        </button>
      </div>
      
      <div style={styles.list}>
        {questions.slice(0, 10).map((q, index) => (
          <div key={q.questionId} style={styles.item}>
            <div style={styles.rank}>#{index + 1}</div>
            <div style={styles.content}>
              <div style={styles.question}>{q.questionText}</div>
              <div style={styles.meta}>
                <span style={styles.intent}>{q.intentId}</span>
                <span style={styles.votes}>{q.totalVotes} votes</span>
                <span style={styles.approval}>
                  {q.approvedCount}✓ {q.rejectedCount}✗
                </span>
              </div>
            </div>
            <div style={styles.right}>
              <div style={styles.approvalBar}>
                <div 
                  style={{
                    ...styles.approvalFill,
                    width: `${q.approvalRate}%`
                  }}
                />
                <span style={styles.approvalText}>{q.approvalRate}%</span>
              </div>
              <div style={{...styles.status, ...getStatusStyle(q.status)}}>
                {q.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: '#1f2937',
    fontWeight: '700',
    letterSpacing: '-0.3px'
  },
  exportBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    background: '#fafbfc',
    transition: 'all 0.2s ease'
  },
  rank: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#667eea',
    minWidth: '32px',
    textAlign: 'center'
  },
  content: {
    flex: 1
  },
  question: {
    fontSize: '15px',
    color: '#1f2937',
    marginBottom: '6px',
    lineHeight: '1.4',
    fontWeight: '500'
  },
  meta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#6b7280'
  },
  intent: {
    background: '#dbeafe',
    color: '#1d4ed8',
    padding: '3px 8px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '11px'
  },
  votes: {
    fontWeight: '600',
    color: '#374151'
  },
  approval: {
    color: '#6b7280',
    fontWeight: '500'
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  approvalBar: {
    position: 'relative',
    width: '90px',
    height: '24px',
    background: '#f3f4f6',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  approvalFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
    transition: 'width 0.3s ease'
  },
  approvalText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '11px',
    fontWeight: '700',
    color: '#1f2937'
  },
  status: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: '600',
    textAlign: 'center',
    minWidth: '90px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  }
};

export default CommonQuestions;