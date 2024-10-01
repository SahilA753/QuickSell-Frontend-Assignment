import React from 'react';
import { getUserById, getUserInitials } from './Helpers';

function Ticket({ ticket, users, groupBy, defaultUserImg }) {
  const user = users.find(user => user.id === ticket.userId);
  const userImage = user && user.image ? user.image : defaultUserImg;
  const initials = getUserInitials(getUserById(users, ticket.userId));
  const backgroundColor = user ? user.color : '#ccc';

  return (
    <div className="ticket-card">
      <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', margin: '0px 10px 10px 0px' }}>
        <span style={{ paddingLeft: '0px', color: 'gray' }}>{ticket.id}</span>
        {groupBy !== 'user' && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="ticket-icons" style={{ paddingRight: '10px' }}>
              <div className="initials-avatar" style={{ backgroundColor }}>
                {initials}
              </div>
            </div>
          </div>
        )}
      </h3>

      <div>
        <h3 style={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          margin: '10px 10px 0px 0px',
          gap: '10px'
        }}>
          {groupBy !== 'status' && (
            <img
              src={`./assets/${ticket.status}.svg`}
              alt={ticket.status}
              style={{ width: '20px', height: '20px' }}
            />
          )}
          {ticket.title}
        </h3>

        <div style={{ display: 'flex', direction: 'row', gap: '10px', marginTop: '12px' }}>
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
              {ticket.tag.join(', ')}
            </div>
          )}
          {(groupBy === 'status' || groupBy === 'user') && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              <img
                src={`./assets/${ticket.priority}.svg`}
                alt={ticket.priority}
                style={{ width: '20px', height: '20px', marginRight: '5px' }}
              />
              <span>{ticket.priority}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ticket;
