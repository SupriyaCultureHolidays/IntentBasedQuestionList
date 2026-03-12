import { useState, useEffect } from 'react';
import api from '../api/axios';
import AdminLayout from './AdminLayout';
import AdminTable from './AdminTable';
import toast from 'react-hot-toast';

const Reports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [intents, setIntents] = useState([]);
  const [filters, setFilters] = useState({ userId: '', intentId: '', decision: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Detailed Reports</h1>
          <p style={styles.subtitle}>Comprehensive feedback analysis and export</p>
        </div>

        <div style={styles.content}>
          <div style={styles.filtersSection}>
            <h2 style={styles.sectionTitle}>Filter & Export Data</h2>
            
            <div style={styles.filters} className="admin-filters">
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
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading detailed reports...</p>
            </div>
          ) : (
            <AdminTable
              feedbacks={filteredFeedbacks}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    padding: '32px 32px 24px',
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '500'
  },
  content: {
    padding: '0 32px 32px'
  },
  filtersSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    margin: '0 0 20px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: '-0.3px'
  },
  filters: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  select: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    minWidth: '200px',
    fontWeight: '500',
    color: '#374151',
    transition: 'border-color 0.2s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  resetBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  loadingText: {
    fontSize: '16px',
    color: '#718096',
    fontWeight: '500'
  }
};

export default Reports;