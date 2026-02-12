import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';

const HealthcareCard = ({ facility }) => {
  const navigate = useNavigate();

  return (
    <div className="card" style={styles.card}>
      <h3 style={styles.title}>{facility.name}</h3>
      <p style={styles.type}>
        <span style={styles.badge}>{facility.type}</span>
        {facility.freeServices && (
          <span style={styles.freeBadge}>Free Services</span>
        )}
      </p>

      {facility.services && (
        <p style={styles.services}>{facility.services}</p>
      )}

      {facility.address && (
        <p style={styles.info}>
          <MapPin size={16} style={styles.icon} />
          {facility.address}
        </p>
      )}

      {facility.contactNumber && (
        <p style={styles.info}>
          <Phone size={16} style={styles.icon} />
          {facility.contactNumber}
        </p>
      )}

      {facility.operatingHours && (
        <p style={styles.info}>
          <Clock size={16} style={styles.icon} />
          {facility.operatingHours}
        </p>
      )}

      <button
        className="btn btn-primary"
        style={styles.button}
        onClick={() => navigate(`/healthcare/${facility.id}`)}
      >
        View Details
      </button>
    </div>
  );
};

const styles = {
  card: {
    transition: 'transform 0.2s'
  },
  title: {
    color: '#1f2937',
    marginBottom: '10px'
  },
  type: {
    marginBottom: '10px',
    display: 'flex',
    gap: '10px'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px'
  },
  freeBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px'
  },
  services: {
    color: '#6b7280',
    marginBottom: '15px'
  },
  info: {
    fontSize: '14px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  icon: {
    color: '#6b7280'
  },
  button: {
    marginTop: '10px'
  }
};

export default HealthcareCard;
