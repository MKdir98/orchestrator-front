import React from "react";

function UserScreen({ vncPort }) {
  return (
    <iframe
      src={`http://localhost:${vncPort}`}
      title="User Screen"
      width="100%"
      height="500px"
      frameBorder="0"
    />
  );
}

export default UserScreen;
