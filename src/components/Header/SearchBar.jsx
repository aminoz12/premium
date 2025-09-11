import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const searchContainerRef = useRef(null)

  const channels = [
    'sky sports', 'bein sports', 'espn', 'fox sports', 'netflix', 'hbo', 
    'disney', 'prime video', 'cnn', 'bbc', 'premier league', 'champions league',
    'formula 1', 'nba', 'tennis', 'football', 'soccer', 'basketball'
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (value) => {
    setSearchTerm(value)
    
    if (value.length > 2) {
      const results = channels.filter(channel => 
        channel.toLowerCase().includes(value.toLowerCase())
      )
      setSearchResults(results)
      setShowResults(results.length > 0)
    } else {
      setShowResults(false)
    }
  }

  const handleResultClick = (result) => {
    setSearchTerm(result)
    setShowResults(false)
    
    // Scroll to channels section
    const channelsSection = document.getElementById('channels')
    if (channelsSection) {
      channelsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <SearchContainer ref={searchContainerRef}>
      <SearchInput
        type="text"
        placeholder="Search channels..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <SearchIcon className="fas fa-search" />
      
      {showResults && (
        <SearchResults>
          {searchResults.map((result, index) => (
            <SearchResultItem 
              key={index}
              onClick={() => handleResultClick(result)}
            >
              {result}
            </SearchResultItem>
          ))}
        </SearchResults>
      )}
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
  position: relative;
`

const SearchInput = styled.input`
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: 40px;
  color: var(--text-primary);
  width: 250px;
  transition: all var(--transition-base);

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`

const SearchIcon = styled.i`
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
`

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 2px;
`

const SearchResultItem = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background var(--transition-base);
  text-transform: capitalize;

  &:hover {
    background: var(--hover-bg);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
`

export default SearchBar
