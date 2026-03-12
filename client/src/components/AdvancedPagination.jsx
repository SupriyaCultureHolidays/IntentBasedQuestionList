import { useState } from 'react';

const AdvancedPagination = ({ currentPage, totalPages, onPageChange }) => {
  const [jumpPage, setJumpPage] = useState('');

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  const handleFirstPage = () => onPageChange(1);
  const handleLastPage = () => onPageChange(totalPages);
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1));

  if (totalPages <= 1) return null;

  return (
    <div style={styles.container}>
      <div style={styles.navigation}>
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          style={{
            ...styles.navButton,
            ...(currentPage === 1 ? styles.disabledButton : {})
          }}
          title="First page"
        >
          ⟪
        </button>
        
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            ...styles.navButton,
            ...(currentPage === 1 ? styles.disabledButton : {})
          }}
          title="Previous page"
        >
          ⟨
        </button>

        <div style={styles.pageNumbers}>
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} style={styles.dots}>...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  ...styles.pageButton,
                  ...(page === currentPage ? styles.activePageButton : {})
                }}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            ...styles.navButton,
            ...(currentPage === totalPages ? styles.disabledButton : {})
          }}
          title="Next page"
        >
          ⟩
        </button>
        
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          style={{
            ...styles.navButton,
            ...(currentPage === totalPages ? styles.disabledButton : {})
          }}
          title="Last page"
        >
          ⟫
        </button>
      </div>

      <div style={styles.info}>
        <span style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        
        {totalPages > 10 && (
          <form onSubmit={handleJumpSubmit} style={styles.jumpForm}>
            <span style={styles.jumpLabel}>Go to:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Page"
              style={styles.jumpInput}
            />
            <button type="submit" style={styles.jumpButton}>
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
    padding: '20px',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  navButton: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: 'white',
    color: '#374151',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledButton: {
    opacity: 0.4,
    cursor: 'not-allowed',
    background: '#f3f4f6'
  },
  pageNumbers: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    margin: '0 12px'
  },
  pageButton: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: 'white',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '40px',
    height: '40px'
  },
  activePageButton: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    color: 'white',
    borderColor: '#4f46e5',
    fontWeight: '600'
  },
  dots: {
    padding: '8px 4px',
    color: '#9ca3af',
    fontSize: '14px',
    fontWeight: '600'
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  jumpForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  jumpLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  jumpInput: {
    width: '70px',
    padding: '6px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  jumpButton: {
    padding: '6px 12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default AdvancedPagination;