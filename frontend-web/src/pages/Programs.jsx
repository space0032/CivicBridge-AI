import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, MapPin } from 'lucide-react';
import { programService } from '../services/api';
import ProgramCard from '../components/ProgramCard';
import useDebounce from '../hooks/useDebounce';

const Programs = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state for search input
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    region: ''
  });

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, region: debouncedSearchTerm }));
  }, [debouncedSearchTerm]);

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
        setError(t('error_loading_program')); // Use localized error key if available, or fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [filters, t]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t('programs')}</h1>
        <p style={styles.subtitle}>
          {t('intro')}
        </p>
      </div>

      <div style={styles.filters}>
        <div className="form-group">
          <label htmlFor="category-filter" style={styles.label}>{t('category')}</label>
          <select
            id="category-filter"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value="">{t('all_categories')}</option>
            <option value="HEALTHCARE">{t('healthcare')}</option>
            <option value="EDUCATION">{t('education')}</option>
            <option value="AGRICULTURE">{t('agriculture')}</option>
            <option value="EMPLOYMENT">{t('employment')}</option>
          </select>
        </div>

        <div className="form-group" style={{ position: 'relative' }}>
          <label htmlFor="region-filter" style={styles.label}>{t('region')}</label>
          <div style={styles.searchWrapper}>
            <MapPin size={18} color="#6b7280" style={styles.searchIcon} />
            <input
              id="region-filter"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('enter_region')}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={clearSearch} style={styles.clearButton} aria-label="Clear search">
                <X size={18} color="#6b7280" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && <div style={styles.loading}>{t('loading')}</div>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {!loading && programs.length > 0 ? (
          programs.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))
        ) : (
          !loading && !error && (
            <div style={styles.noResults}>
              <Search size={48} color="#d1d5db" style={{ marginBottom: '10px' }} />
              <p>{t('no_results')}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '40px',
    paddingBottom: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '36px',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto'
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f3f4f6'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    fontSize: '16px',
    color: '#1f2937',
    outline: 'none',
    transition: 'border-color 0.2s',
    cursor: 'pointer'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '10px 40px 10px 40px', // Right padding for clear button
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px'
  },
  error: {
    color: '#dc2626',
    padding: '12px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
    fontSize: '18px'
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

export default Programs;
