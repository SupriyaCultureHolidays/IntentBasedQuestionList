import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import AdminTable from './AdminTable';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [intents, setIntents] = useState([]);
  const [filters, setFilters] = useState({ userId: '', intentId: '', decision: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbacks, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fRes, uRes, iRes] = await Promise.all([
        api.get('/admin/feedbacks'),
        api.get('/admin/users'),
        api.get('/admin/intents')
      ]);
      setFeedbacks(fRes.data.data);
      setUsers(uRes.data.data);
      setIntents(iRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedbacks];

    if (filters.userId) {
      filtered = filtered.filter(f => f.userEmail === filters.userId);
    }
    if (filters.intentId) {
      filtered = filtered.filter(f => f.intent === filters.intentId);
    }
    if (filters.decision) {
      filtered = filtered.filter(f => f.decision === filters.decision);
    }

    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({ userId: '', intentId: '', decision: '' });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Culture Holidays – Admin Panel</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div style={styles.main}>
        <h2 style={styles.pageTitle}>User-wise FAQ Feedback Report</h2>

        <div style={styles.filters}>
          <select
            value={filters.userId}
            onChange={(e) => handleFilterChange('userId', e.target.value)}
            style={styles.select}
          >
            <option value="">All Users</option>
            {users.map(u => (
              <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
            ))}
          </select>

          <select
            value={filters.intentId}
            onChange={(e) => handleFilterChange('intentId', e.target.value)}
            style={styles.select}
          >
            <option value="">All Intents</option>
            {intents.map(i => (
              <option key={i._id} value={i._id}>{i.intentName}</option>
            ))}
          </select>

          <select
            value={filters.decision}
            onChange={(e) => handleFilterChange('decision', e.target.value)}
            style={styles.select}
          >
            <option value="">All Decisions</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button onClick={resetFilters} style={styles.resetBtn}>
            Reset Filters
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <AdminTable
            feedbacks={filteredFeedbacks}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#f5f5f5'
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
    flex: 1,
    padding: '24px',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto'
  },
  pageTitle: {
    margin: '0 0 24px',
    fontSize: '28px',
    color: '#333'
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  select: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: 'white',
    minWidth: '200px'
  },
  resetBtn: {
    padding: '10px 20px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  }
};

export default AdminDashboard;
