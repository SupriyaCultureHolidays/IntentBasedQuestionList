import { useState } from 'react';

const QuestionRow = ({ question, feedback, onFeedback }) => {
  const handleApprove = () => {
    onFeedback(question._id, 'approved');
  };

  const handleReject = () => {
    onFeedback(question._id, 'rejected');
  };

  return (
    <div style={styles.row}>
      <div style={styles.content}>
        <p style={styles.text}>{question.questionText}</p>
      </div>
      <div style={styles.actions}>
        <button
          onClick={handleApprove}
          style={{
            ...styles.actionBtn,
            ...(feedback?.decision === 'approved' ? styles.approvedActive : {})
          }}
        >
          ✓
        </button>
        <button
          onClick={handleReject}
          style={{
            ...styles.actionBtn,
            ...(feedback?.decision === 'rejected' ? styles.rejectedActive : {})
          }}
        >
          ✗
        </button>
      </div>
    </div>
  );
};

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    gap: '16px'
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  text: {
    margin: 0,
    flex: 1,
    color: '#333'
  },

  actions: {
    display: 'flex',
    gap: '8px'
  },
  actionBtn: {
    width: '40px',
    height: '40px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  approvedActive: {
    background: '#4caf50',
    color: 'white',
    borderColor: '#4caf50'
  },
  rejectedActive: {
    background: '#f44336',
    color: 'white',
    borderColor: '#f44336'
  }
};

export default QuestionRow;
