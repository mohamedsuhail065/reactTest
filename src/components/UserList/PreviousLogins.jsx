import React from "react";

const PreviousLogins = ({ user,onClose }) => {
  if (!user || !user.previousLogins) return null;
  return (
    <div className="previous-logins">
      <h2>Previous Logins for {user.username}</h2>
      <ul>
        {user.previousLogins.length > 0 ? (
          user.previousLogins.map((login, index) => (
            <li key={index}>{login}</li>
          ))
        ) : (
          <li>No previous Logins recorded</li>
        )}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PreviousLogins;
