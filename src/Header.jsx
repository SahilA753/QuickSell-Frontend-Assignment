import React from 'react';

function Header({ dropdownImg, isDropdownOpen, setIsDropdownOpen, groupBy, setGroupBy, sortBy, setSortBy }) {
  return (
    <header className="header">
      <h2>Ticket Management</h2>
      <div className="controls">
        <div className="dropdown-container">
        <button
            className="dropdown-button"
            style={{
                display: 'flex',        
                alignItems: 'center',
                justifyContent: 'center', 
                gap: '8px' 
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
            <img src={dropdownImg} alt="Display" /> 
            Display 
            <img src='/assets/down.svg' alt="Dropdown arrow" />
            </button>

          <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
            <label>
              <div className='inner-dropdown'>
                Grouping
                <select value={groupBy} className='select' onChange={(e) => setGroupBy(e.target.value)}>
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </label>
            <label>
              <div className='inner-dropdown'>
                Ordering
                <select value={sortBy} className='select' onChange={(e) => setSortBy(e.target.value)}>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
