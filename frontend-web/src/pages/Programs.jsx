import { useState, useEffect } from 'react';
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

  const isProgramActive = (deadline) => {
    if (!deadline) return true;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    return deadline >= todayStr;
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await programService.getAll(filters);
        const data = response.data.data || [];

        // Filter out expired programs
        const activePrograms = data.filter(program => isProgramActive(program.applicationDeadline));

        setPrograms(activePrograms);
        setError(null);
      } catch (err) {
        setError('Failed to load programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t('programs')}</h1>
        <p style={styles.subtitle}>
          Explore a wide range of government programs and find the support you need.
        </p>
      </div>

      <div style={styles.filters}>
        <div className="form-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value="">All Categories</option>
            <option value="HEALTHCARE">Healthcare</option>
            <option value="EDUCATION">Education</option>
            <option value="AGRICULTURE">Agriculture</option>
            <option value="EMPLOYMENT">Employment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="region-filter">Region</label>
          <input
            id="region-filter"
            type="text"
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            placeholder="Enter your region"
            style={styles.input}
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
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '36px',
    color: '#1f2937',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto'
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
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
