export const getUserById = (users, userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  export const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    return nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '');
  };
  
  export const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  export const priorityMap = {
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
    0: 'No priority',
  };
  
  export const reversePriorityMap = Object.fromEntries(
    Object.entries(priorityMap).map(([key, value]) => [value, parseInt(key)])
  );