import React, { useState, useEffect } from 'react';
import './App.css';
const dropdownImg = './assets/Display.svg';
const defaultUserImg = './assets/Default.svg';

const priorityMap = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority',
};

const priorityColors = {
  Urgent: '#ff4d4f',  // High priority (Red)
  High: '#ffa940',    // Medium priority (Orange)
  Medium: '#fadb14',
  Low: '#52c41a',
  'No priority': '#d9d9d9',
};

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For handling dropdown visibility

  useEffect(() => {
    // Fetch data from the provided API
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();

        // Generate a random color for each user
        const usersWithColors = data.users.map(user => ({
          ...user,
          color: generateRandomColor() // Assign a random color
        }));

        // Map ticket priorities to their string representation
        const mappedTickets = data.tickets.map(ticket => ({
          ...ticket,
          priority: priorityMap[ticket.priority] // Map numeric priority to string
        }));

        setTickets(mappedTickets); // Set mapped tickets
        setUsers(usersWithColors); // Set users with colors
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data from the API');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get the user's name from userId
  const getUserById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Helper function to get the user's initials
  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    return nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '');
  };

  // Function to generate random background color for initials avatar
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Group tickets manually by status, user, or priority
  const getGroupedTickets = () => {
    let groupedTickets = {};

    if (groupBy === 'status') {
      tickets.forEach((ticket) => {
        if (!groupedTickets[ticket.status]) {
          groupedTickets[ticket.status] = [];
        }
        groupedTickets[ticket.status].push(ticket);
      });
    } else if (groupBy === 'user') {
      tickets.forEach((ticket) => {
        if (!groupedTickets[ticket.userId]) {
          groupedTickets[ticket.userId] = [];
        }
        groupedTickets[ticket.userId].push(ticket);
      });
    } else if (groupBy === 'priority') {
      tickets.forEach((ticket) => {
        if (!groupedTickets[ticket.priority]) {
          groupedTickets[ticket.priority] = [];
        }
        groupedTickets[ticket.priority].push(ticket);
      });
    }

    return groupedTickets;
  };

  const sortTickets = (ticketsGroup) => {
    return ticketsGroup.sort((a, b) => {
      if (sortBy === 'priority') {
        return Object.keys(priorityMap).find(key => priorityMap[key] === b.priority) - Object.keys(priorityMap).find(key => priorityMap[key] === a.priority);
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  const groupedTickets = getGroupedTickets();

  return (
    <div className="kanban-board">
      <header className="header">
        <h2>Ticket Management</h2>
        <div className="controls">
          <div className="dropdown-container">
            <button className="dropdown-button" style={{ justifyContent: 'center' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img src={dropdownImg} alt="Display" /> Display <img src='/assets/down.svg' />
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

      <div className="kanban-groups">
        {Object.keys(groupedTickets).length === 0 ? (
          <div className="empty-group">No tickets available</div>
        ) : (
          Object.keys(groupedTickets).map((group) => (
            <div key={group} className="group-box">
              <h2 className="group-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  {groupBy === 'user' ? (
                    // Render initials avatar with a background color when grouped by user
                    <div 
                      className="initials-avatar" 
                      style={{
                        backgroundColor: users.find(user => user.id === group)?.color || generateRandomColor(), // Use existing color or generate a random one
                        width: '40px', 
                        height: '40px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        borderRadius: '50%',
                        marginRight: '5px',
                        color: 'white', // Set text color to white for better contrast
                        fontWeight: 'bold', // Make initials bold
                        fontSize: '16px'
                      }}
                    >
                      {getUserInitials(getUserById(group))} {/* Display the initials */}
                    </div>
                  ) : (
                    // Keep the default icon for other groupings (status, priority)
                    <img
                      src={`./assets/${groupBy === 'status' ? `${group}` : `${group}`}.svg`}
                      className="group-icon"
                      style={{ marginRight: '5px' }}
                      alt={groupBy}
                    />
                  )}
                  {groupBy === 'status'
                    ? `${group}`
                    : groupBy === 'user'
                    ? `${getUserById(group)}`
                    : `${group}`}
                  <span style={{ marginLeft: '5px', color: 'gray' }}>({groupedTickets[group].length})</span>
                </div>

                <div className="group-actions" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/assets/add.svg" alt="Add" className="icon-action" />
                  <img src="/assets/3dot.svg" alt="More options" className="icon-action" style={{ marginLeft: '5px' }} />
                </div>
              </h2>

              <div className="group-tickets">
                {sortTickets(groupedTickets[group]).map((ticket) => {
                  const user = users.find(user => user.id === ticket.userId);
                  const userImage = user && user.image ? user.image : defaultUserImg; 
                  const initials = getUserInitials(getUserById(ticket.userId));
                  const backgroundColor = user ? user.color : '#ccc'; 

                  return (
                    <div key={ticket.id} className={`ticket-card`}>
                      <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', margin: '0px 10px 10px 0px' }}>
                        <span style={{ paddingLeft: '0px', color: 'gray' }}>{ticket.id}</span> {/* Add padding to the title */}
                        
                       {(groupBy!='user')&& (<div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="ticket-icons" style={{ paddingRight: '10px' }}> {/* Add padding to the image container */}
                            <div className="initials-avatar" style={{ backgroundColor }}>
                              {initials}
                            </div>
                          </div>
                        </div>)}
                      </h3>
                      
                      <div>
                      <h3 style={{ 
                          display: 'flex', 
                          justifyContent: 'flex-start', // Align items to the left
                          // alignItems: 'center', 
                          width: '100%', 
                          margin: '10px 10px 0px 0px',
                          gap: '10px' // Add a gap of 10px between the icon and the title
                        }}>
                          
                          {(groupBy!='status')&&(<img 
                            src={`./assets/${ticket.status}.svg`} // Assuming status icon files are named after the status
                            alt={ticket.status}
                            style={{ width: '20px', height: '20px' }} // Adjust icon size as needed
                          />)}

                          {ticket.title}
                      </h3>

                      <div style={{display:'flex',direction:'row',gap:'10px', marginTop:'12px'}}>
                        {ticket.tag && ticket.tag.length > 0 && (
                          <div style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            marginTop: '5px',
                            border: '0.5px solid gray',
                            borderRadius: '5px',
                            fontSize: '12px',
                            color: 'gray'
                          }}>
                            {ticket.tag.join(', ')} {/* Joining the tags with a comma if there are multiple */}
                          </div>
                        )}

                        {(groupBy === 'status' || groupBy === 'user') && (
                          <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                            <img 
                              src={`./assets/${ticket.priority}.svg`}  // Assuming priority is the name of the icon file
                              alt={ticket.priority}
                              style={{ width: '20px', height: '20px', marginRight: '5px' }} // Adjust size as needed
                            />
                            <span>{ticket.priority}</span> 
                          </div>
                        )}
                      </div>
                      </div>
                    
                    </div>

                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      
    </div>
  );
}

export default App;
