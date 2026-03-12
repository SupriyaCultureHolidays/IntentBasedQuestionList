import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import QuestionRow from './QuestionRow';
import AddQuestionModal from './AddQuestionModal';
import { AuthContext } from '../context/AuthContext';

const QuestionPanel = ({ intent }) => {
  const [questions, setQuestions] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (intent) {
      fetchQuestions();
    }
  }, [intent]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const [qRes, fRes] = await Promise.all([
        api.get(`/questions?intentId=${intent._id}`),
        api.get('/feedbacks/my')
      ]);
      setQuestions(qRes.data.data);
      
      const feedbackMap = {};
      fRes.data.data.forEach(f => {
        feedbackMap[f.questionId] = f;
      });
      setFeedbacks(feedbackMap);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (questionId, decision) => {
    try {
      const question = questions.find(q => q._id === questionId);
      const { data } = await api.post('/feedbacks', {
        questionId,
        questionText: question.questionText,
        intentId: intent._id,
        decision
      });
      setFeedbacks({ ...feedbacks, [questionId]: data.data });
      toast.success(`Question ${decision}`);
    } catch (error) {
      toast.error('Failed to save feedback');
    }
  };

  const handleAddQuestion = async (questionText) => {
    try {
      const { data } = await api.post('/questions', {
        intentId: intent._id,
        questionText
      });
      setQuestions([data.data, ...questions]);
      setShowModal(false);
      toast.success('Question added');
    } catch (error) {
      toast.error('Failed to add question');
    }
  };

  if (!intent) {
    return (
      <div style={styles.empty}>
        <p>Select an intent to view questions</p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Intent: {intent._id}</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.addBtn}>
          + Add Question
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : questions.length === 0 ? (
        <div style={styles.empty}>No questions yet</div>
      ) : (
        <div style={styles.list}>
          {questions.map(q => (
            <QuestionRow
              key={q._id}
              question={q}
              feedback={feedbacks[q._id]}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddQuestionModal
          intent={intent}
          onClose={() => setShowModal(false)}
          onAdd={handleAddQuestion}
        />
      )}
    </div>
  );
};

const styles = {
  panel: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: '-0.4px'
  },
  addBtn: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
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
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#9ca3af',
    fontSize: '16px',
    fontWeight: '500'
  }
};

export default QuestionPanel;
