import { useState } from 'react';

const AddQuestionModal = ({ intent, onClose, onAdd }) => {
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(questionText);
    setLoading(false);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Add Question</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Intent</label>
            <input
              type="text"
              value={intent._id}
              disabled
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Question</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              style={styles.textarea}
              placeholder="Enter your question..."
            />
          </div>
          <div style={styles.buttons}>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Adding...' : 'Add Question'}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  title: {
    margin: '0 0 24px',
    fontSize: '24px',
    color: '#333'
  },
  field: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: '#f5f5f5'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    minHeight: '100px',
    resize: 'vertical'
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  submitBtn: {
    padding: '10px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  cancelBtn: {
    padding: '10px 24px',
    background: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default AddQuestionModal;
