import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';

const HealthcareCard = ({ facility }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/healthcare/${facility.id}`);
  };

  return (
    <div 
      className="card" 
      style={styles.card}
      onClick={handleCardClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
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

      <div style={{ marginTop: 'auto' }}>
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
      </div>
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
  type: {
    marginBottom: '15px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  freeBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  services: {
    color: '#6b7280',
    marginBottom: '15px',
    flexGrow: 1
  },
  info: {
    fontSize: '14px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  icon: {
    color: '#6b7280',
    flexShrink: 0
  }
};

export default HealthcareCard;
