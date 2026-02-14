import { useNavigate } from 'react-router-dom';

const ProgramCard = ({ program }) => {
  const navigate = useNavigate();

  const isProgramActive = (deadline) => {
    if (!deadline) return true;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    return deadline >= todayStr;
  };

  const active = isProgramActive(program.applicationDeadline);

  const handleCardClick = () => {
    navigate(`/programs/${program.id}`);
  };

  return (
    <div
      className="card"
      style={{
        ...styles.card,
        opacity: active ? 1 : 0.8,
        border: active ? '1px solid #e5e7eb' : '1px solid #fee2e2'
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={styles.headerRow}>
        <h3 style={styles.title}>{program.name}</h3>
        {!active && <span style={styles.expiredBadge}>Expired</span>}
      </div>
      <p style={styles.category}>
        <span style={styles.badge}>{program.category}</span>
      </p>
      <p style={styles.description}>{program.description}</p>

      {program.region && (
        <p style={styles.info}>
          <strong>Region:</strong> {program.region}
        </p>
      )}

      {program.eligibilityCriteria && (
        <p style={styles.info}>
          <strong>Eligibility:</strong> {program.eligibilityCriteria}
        </p>
      )}

      {program.applicationDeadline && (
        <p style={{
          ...styles.deadline,
          color: active ? '#dc2626' : '#9ca3af'
        }}>
          <strong>Deadline:</strong> {program.applicationDeadline}
        </p>
      )}

      {program.contactInfo && (
        <p style={styles.info}>
          <strong>Contact:</strong> {program.contactInfo}
        </p>
      )}

      <button
        className="btn btn-primary"
        style={{
          ...styles.button,
          backgroundColor: active ? '#2563eb' : '#9ca3af',
          cursor: active ? 'pointer' : 'not-allowed'
        }}
        disabled={!active}
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click event from firing
          if (active) navigate(`/apply/${program.id}`);
        }}
      >
        {active ? 'Apply Now' : 'Application Closed'}
      </button>
    </div>
  );
};

const styles = {
  card: {
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  title: {
    color: '#1f2937',
    marginBottom: '10px',
    fontSize: '18px',
    flex: 1
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '5px'
  },
  expiredBadge: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  category: {
    marginBottom: '10px'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  description: {
    color: '#6b7280',
    marginBottom: '15px',
    flexGrow: 1
  },
  info: {
    fontSize: '14px',
    marginBottom: '8px'
  },
  deadline: {
    fontSize: '14px',
    color: '#dc2626',
    marginBottom: '15px'
  },
  button: {
    marginTop: 'auto',
    width: '100%'
  }
};

export default ProgramCard;
