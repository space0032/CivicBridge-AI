import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { programService } from '../services/api';
import ProgramCard from '../components/ProgramCard';

const Programs = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    region: ''
  });

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await programService.getAll(filters);
      setPrograms(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load programs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>{t('programs')}</h1>
      
      <div style={styles.filters}>
        <div className="form-group">
          <label>Category</label>
          <select 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="HEALTHCARE">Healthcare</option>
            <option value="EDUCATION">Education</option>
            <option value="AGRICULTURE">Agriculture</option>
            <option value="EMPLOYMENT">Employment</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Region</label>
          <input 
            type="text"
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            placeholder="Enter your region"
          />
        </div>
      </div>

      {loading && <p>Loading programs...</p>}
      {error && <p style={styles.error}>{error}</p>}
      
      <div style={styles.grid}>
        {programs.length > 0 ? (
          programs.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))
        ) : (
          !loading && <p>No programs found. Try adjusting your filters.</p>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
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
  }
};

export default Programs;
