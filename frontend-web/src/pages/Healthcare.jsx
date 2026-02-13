import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { healthcareService } from '../services/api';
import { getGeolocation } from '../utils/geolocation';
import HealthcareCard from '../components/HealthcareCard';
import { MapPin } from 'lucide-react';
import logger from '../utils/logger';

const Healthcare = () => {
  const { t } = useTranslation();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    freeServices: false
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const response = await healthcareService.getAll(filters);
        setFacilities(response.data.data || []);
        setError(null);
      } catch (err) {
        setError(t('error_loading_facility'));
        logger.error('Failed to load healthcare facilities', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [filters]);

  const findNearby = async () => {
    try {
      setLoading(true);
      const coords = await getGeolocation();
      setLocation(coords);

      const response = await healthcareService.getNearby(
        coords.latitude,
        coords.longitude,
        10
      );
      setFacilities(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(t('error_loading_facility'));
      logger.error('Failed to get your location or find nearby facilities', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>{t('healthcare')}</h1>

      <div style={styles.filters}>
        <div className="form-group">
          <label>Facility Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="HOSPITAL">Hospital</option>
            <option value="CLINIC">Clinic</option>
            <option value="VACCINATION_CENTER">Vaccination Center</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="freeServices"
              checked={filters.freeServices}
              onChange={handleFilterChange}
              style={styles.checkbox}
            />
            Free Services Only
          </label>
        </div>

        <button
          className="btn btn-primary"
          onClick={findNearby}
          style={styles.nearbyButton}
        >
          <MapPin size={18} style={{ marginRight: '5px' }} />
          Find Nearby
        </button>
      </div>

      {loading && <p>Loading healthcare facilities...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {location && (
        <p style={styles.locationInfo}>
          Showing facilities near your location
        </p>
      )}

      <div style={styles.grid}>
        {facilities.length > 0 ? (
          facilities.map(facility => (
            <HealthcareCard key={facility.id} facility={facility} />
          ))
        ) : (
          !loading && <p>No healthcare facilities found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '40px',
    paddingBottom: '40px'
  },
  title: {
    fontSize: '36px',
    color: '#1f2937',
    marginBottom: '30px'
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    alignItems: 'end'
  },
  checkbox: {
    marginRight: '8px'
  },
  nearbyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  error: {
    color: '#dc2626',
    padding: '10px',
    backgroundColor: '#fee2e2',
    borderRadius: '5px',
    marginBottom: '20px'
  },
  locationInfo: {
    color: '#059669',
    padding: '10px',
    backgroundColor: '#d1fae5',
    borderRadius: '5px',
    marginBottom: '20px'
  }
};

export default Healthcare;
