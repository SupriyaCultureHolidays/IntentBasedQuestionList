import { useState, useMemo } from 'react';
import AdvancedPagination from './AdvancedPagination';

const IntentLeaderboard = ({ intents }) => {
  const [expandedIntent, setExpandedIntent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredIntents = useMemo(() => {
    return intents.filter(intent => 
      intent.intentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [intents, searchTerm]);

  const paginatedIntents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredIntents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredIntents, currentPage]);

  const totalPages = Math.ceil(filteredIntents.length / itemsPerPage);

  const toggleIntent = (intentName) => {
    setExpandedIntent(expandedIntent === intentName ? null : intentName);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setExpandedIntent(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Intent Leaderboard</h3>
        <div style={styles.stats}>
          {filteredIntents.length} of {intents.length} intents
        </div>
      </div>
      
      {intents.length > 5 && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search intents..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>
      )}
      
      <div style={styles.list}>
        {paginatedIntents.map((intent) => (
          <div key={intent.intentName} style={styles.intentCard}>
            <div 
              style={styles.intentHeader}
              onClick={() => toggleIntent(intent.intentName)}
            >
              <div style={styles.intentInfo}>
                <span style={styles.intentName}>{intent.intentName}</span>
                <span style={styles.intentVotes}>{intent.totalVotes} total votes</span>
              </div>
              <span style={styles.expandIcon}>
                {expandedIntent === intent.intentName ? '▼' : '▶'}
              </span>
            </div>
            
            {expandedIntent === intent.intentName && (
              <div style={styles.questionsContainer}>
                {intent.topQuestions.length > 0 ? (
                  intent.topQuestions.map((q, index) => (
                    <div key={index} style={styles.questionItem}>
                      <div style={styles.questionRank}>#{index + 1}</div>
                      <div style={styles.questionContent}>
                        <div style={styles.questionText}>{q.questionText}</div>
                        <div style={styles.questionMeta}>
                          {q.totalVotes} votes • {q.approvalRate}% approval
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.noQuestions}>No questions yet</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      
      {filteredIntents.length === 0 && searchTerm && (
        <div style={styles.noResults}>
          No intents found matching "{searchTerm}"
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
  stats: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500'
  },
  searchContainer: {
    marginBottom: '16px'
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit'
  },
  noResults: {
    textAlign: 'center',
    padding: '32px',
    color: '#9ca3af',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  intentCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  },
  intentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: '#f9fafb',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  intentInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  intentName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1f2937'
  },
  intentVotes: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '400'
  },
  expandIcon: {
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500'
  },
  questionsContainer: {
    padding: '16px 20px',
    background: 'white'
  },
  questionItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6'
  },
  questionRank: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#4f46e5',
    minWidth: '24px'
  },
  questionContent: {
    flex: 1
  },
  questionText: {
    fontSize: '14px',
    color: '#1f2937',
    marginBottom: '4px',
    lineHeight: '1.4',
    fontWeight: '400'
  },
  questionMeta: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '400'
  },
  noQuestions: {
    fontSize: '13px',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '12px'
  }
};

export default IntentLeaderboard;