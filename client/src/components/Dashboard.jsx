import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from './Sidebar';
import QuestionPanel from './QuestionPanel';

const Dashboard = () => {
  const [intents, setIntents] = useState([]);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    try {
      const { data } = await api.get('/intents');
      setIntents(data.data);
      if (data.data.length > 0) {
        setSelectedIntent(data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch intents');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Culture Holidays</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>
      <div style={styles.main}>
        <Sidebar
          intents={intents}
          selectedIntent={selectedIntent}
          onSelectIntent={setSelectedIntent}
        />
        <QuestionPanel intent={selectedIntent} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: '#667eea',
    color: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userName: {
    fontSize: '16px'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  }
};

export default Dashboard;
