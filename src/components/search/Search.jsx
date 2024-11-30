import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showResults) return;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prevIndex) => 
            Math.min(prevIndex + 1, results.length - 1)
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
          break;
        case 'Enter':
          if (selectedIndex !== -1 && results[selectedIndex]) {
            navigateToResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowResults(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, showResults]);

  const performSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
      );
      setResults(response.data);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToResult = (item) => {
    switch(item.type) {
      case 'challenge':
        navigate(`/editor/${item._id}`);
        break;
      default:
        navigate(`/search?q=${query}`);
    }
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="search-container">
      <div className="search">
        <SearchIcon size={24} strokeWidth={2} className="search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {isLoading && <div className="search-loader">...</div>}
      </div>
      
      {showResults && results.length > 0 && (
        <ul className="search-results" ref={resultsRef}>
          {results.map((item, index) => (
            <li
              key={item._id}
              className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
              onMouseDown={() => navigateToResult(item)}
            >
              {item.name} 
              <span className="search-result-type">{item.type}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;