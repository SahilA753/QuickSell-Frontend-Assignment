import React from 'react';
import Ticket from './Ticket';
import { reversePriorityMap, getUserInitials,getUserById, generateRandomColor } from './Helpers';  

function KanbanGroup({ group, tickets, groupBy, users, defaultUserImg, sortBy }) {
  const sortedTickets = tickets.sort((a, b) => {
    if (sortBy === 'priority') {
   
      const priorityA = reversePriorityMap[a.priority];
      const priorityB = reversePriorityMap[b.priority];

      return priorityB - priorityA; 
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <div className="group-box">
      <h2 className="group-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {groupBy === 'user' ? (
            <div
              className="initials-avatar"
              style={{
                backgroundColor: users.find(user => user.id === group)?.color || '#ccc',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                marginRight: '5px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {getUserInitials(getUserById(users, group))}
            </div>
          ) : (
            <img
              src={`./assets/${groupBy === 'status' ? `${group}` : `${group}`}.svg`}
              className="group-icon"
              style={{ marginRight: '5px' }}
              alt={groupBy}
            />
          )}
          {groupBy === 'status' ? group : groupBy === 'user' ? getUserById(users, group) : group}
          <span style={{ marginLeft: '5px', color: 'gray' }}>({tickets.length})</span>
        </div>

        <div className="group-actions" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/add.svg" alt="Add" className="icon-action" />
          <img src="/assets/3dot.svg" alt="More options" className="icon-action" style={{ marginLeft: '5px' }} />
        </div>
      </h2>

      <div className="group-tickets">
        {sortedTickets.map((ticket) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            users={users}
            groupBy={groupBy}
            defaultUserImg={defaultUserImg}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanGroup;
