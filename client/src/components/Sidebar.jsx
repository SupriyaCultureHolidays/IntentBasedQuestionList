const Sidebar = ({ intents, selectedIntent, onSelectIntent }) => {
  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>Intents</h3>
      <div style={styles.list}>
        {intents.map(intent => (
          <div
            key={intent._id}
            onClick={() => onSelectIntent(intent)}
            style={{
              ...styles.item,
              ...(selectedIntent?._id === intent._id ? styles.itemActive : {})
            }}
          >
            {intent.intentName}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    background: '#f8f9fa',
    borderRight: '1px solid #e0e0e0',
    padding: '20px',
    overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  title: {
    margin: '0 0 16px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: '-0.3px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  item: {
    padding: '12px',
    background: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  itemActive: {
    background: '#667eea',
    color: 'white',
    borderColor: '#667eea',
    fontWeight: '600'
  }
};

export default Sidebar;
