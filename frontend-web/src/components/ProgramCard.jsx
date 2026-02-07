import React from 'react';

const ProgramCard = ({ program }) => {
  return (
    <div className="card" style={styles.card}>
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
      
      <button className="btn btn-primary" style={styles.button}>
        Learn More
      </button>
    </div>
  );
};

const styles = {
  card: {
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  title: {
    color: '#1f2937',
    marginBottom: '10px'
  },
  category: {
    marginBottom: '10px'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px'
  },
  description: {
    color: '#6b7280',
    marginBottom: '15px'
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
    marginTop: '10px'
  }
};

export default ProgramCard;
