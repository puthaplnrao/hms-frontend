import React from "react";
import Sidebar from "../components/Sidebar";

function Message() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2>💬 Messages</h2>
        <p>View and manage your messages here.</p>
      </div>
    </div>
  );
}

export default Message;
