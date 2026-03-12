import { useState, useEffect } from 'react';
import api from '../api/axios';
import AdminLayout from './AdminLayout';
import DashboardStats from './DashboardStats';
import CommonQuestions from './CommonQuestions';
import IntentLeaderboard from './IntentLeaderboard';
import UserActivity from './UserActivity';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [commonQuestions, setCommonQuestions] = useState([]);
  const [intentLeaderboard, setIntentLeaderboard] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, questionsRes, leaderboardRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/common-questions'),
        api.get('/admin/intent-leaderboard')
      ]);
      setDashboardStats(statsRes.data.data);
      setCommonQuestions(questionsRes.data.data);
      setIntentLeaderboard(leaderboardRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const navigateToReports = () => {
    window.location.href = '/reports';
  };

  const handleExportChatbotReady = async () => {
    try {
      const response = await api.get('/admin/export-chatbot-ready');
      const data = response.data.data;
      
      if (data.length === 0) {
        toast.error('No chatbot-ready questions found');
        return;
      }
      
      const headers = ['Question', 'Intent', 'Approval Rate', 'Total Votes'];
      const rows = data.map(q => [q.question, q.intent, `${q.approvalRate}%`, q.totalVotes]);
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-ready-questions-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Exported ${data.length} chatbot-ready questions`);
    } catch (error) {
      toast.error('Failed to export chatbot-ready questions');
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard Overview</h1>
          <p style={styles.subtitle}>Monitor question consensus and chatbot readiness</p>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading dashboard...</p>
          </div>
        ) : (
          <div style={styles.content}>
            {/* Dashboard Stats */}
            <DashboardStats stats={dashboardStats} />
            
            {/* Main Content Grid */}
            <div style={styles.contentGrid} className="admin-content-grid">
              <div style={styles.leftColumn}>
                <CommonQuestions 
                  questions={commonQuestions} 
                  onExportChatbotReady={handleExportChatbotReady}
                />
              </div>
              <div style={styles.rightColumn}>
                <IntentLeaderboard intents={intentLeaderboard} />
                <div style={styles.spacer} />
                <UserActivity inactiveUsers={dashboardStats.inactiveUsers || []} />
              </div>
            </div>
          </div>
        )}
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
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  spacer: {
    height: '16px'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    margin: '0 32px'
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

export default AdminDashboard;