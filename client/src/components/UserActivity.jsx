const UserActivity = ({ inactiveUsers }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>User Participation</h3>
      
      {inactiveUsers.length > 0 ? (
        <div>
          <div style={styles.subtitle}>
            ⚠️ {inactiveUsers.length} user(s) haven't reviewed questions in the last 7 days:
          </div>
          <div style={styles.userList}>
            {inactiveUsers.map((user) => (
              <div key={user.email} style={styles.userItem}>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userEmail}>{user.email}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.allActive}>
          ✅ All users have been active in the last 7 days
        </div>
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
    border: '1px solid rgba(0,0,0,0.05)'
  },
  title: {
    margin: '0 0 20px',
    fontSize: '20px',
    color: '#1f2937',
    fontWeight: '600',
    letterSpacing: '-0.3px'
  },
  subtitle: {
    fontSize: '15px',
    color: '#f59e0b',
    marginBottom: '16px',
    fontWeight: '500'
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  userItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#fef3c7',
    borderRadius: '8px',
    border: '1px solid #fbbf24'
  },
  userName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1f2937'
  },
  userEmail: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '400'
  },
  allActive: {
    fontSize: '15px',
    color: '#10b981',
    fontWeight: '500',
    textAlign: 'center',
    padding: '20px',
    background: '#d1fae5',
    borderRadius: '8px',
    border: '1px solid #34d399'
  }
};

export default UserActivity;