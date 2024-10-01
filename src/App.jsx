import React, { useState, useEffect } from 'react';
import Header from './Header';
import KanbanGroup from './KanbanGroup';
import './App.css';
import { getUserById, getUserInitials, generateRandomColor, priorityMap } from './Helpers';

const dropdownImg = './assets/Display.svg';
const defaultUserImg = './assets/Default.svg';

function App() {
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(() => {
    const savedGroupBy = localStorage.getItem('groupBy');
    return savedGroupBy ? savedGroupBy : 'status';
  });
  const [sortBy, setSortBy] = useState(() => {
    const savedSortBy = localStorage.getItem('sortBy');
    return savedSortBy ? savedSortBy : 'priority';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        
        const usersWithColors = data.users.map(user => ({
          ...user,
          color: generateRandomColor()
        }));
        
        const mappedTickets = data.tickets.map(ticket => ({
          ...ticket,
          priority: priorityMap[ticket.priority]
        }));

        setTickets(mappedTickets);
        setUsers(usersWithColors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data from the API');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy', sortBy);
  }, [groupBy, sortBy]);

  const getGroupedTickets = () => {
    let groupedTickets = {};

    tickets.forEach((ticket) => {
      const groupKey = groupBy === 'user' ? ticket.userId : groupBy === 'priority' ? ticket.priority : ticket.status;
      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      groupedTickets[groupKey].push(ticket);
    });

    return groupedTickets;
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <h2>Loading...</h2>
    </div>
  );

  const groupedTickets = getGroupedTickets();

  return (
    <div className="kanban-board">
      <Header
        dropdownImg={dropdownImg}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="kanban-groups">
        {Object.keys(groupedTickets).length === 0 ? (
          <div className="empty-group">No tickets available</div>
        ) : (
          Object.keys(groupedTickets).map((group) => (
            <KanbanGroup
              key={group}
              group={group}
              tickets={groupedTickets[group]}
              groupBy={groupBy}
              users={users}
              defaultUserImg={defaultUserImg}
              sortBy={sortBy}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
