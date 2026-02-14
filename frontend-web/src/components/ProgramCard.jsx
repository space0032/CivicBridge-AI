import { useNavigate } from 'react-router-dom';

const ProgramCard = ({ program }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/programs/${program.id}`);
  };

  return (
    <div 
      className="card" 
      style={styles.card} 
      onClick={handleCardClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <h3 style={styles.title}>{program.name}</h3>
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
        <p style={styles.deadline}>
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
        style={styles.button}
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click event from firing
          navigate(`/apply/${program.id}`);
        }}
      >
        Apply Now
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
    fontSize: '18px'
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
