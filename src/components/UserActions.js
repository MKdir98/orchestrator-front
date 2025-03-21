import React from "react";
import axios from "axios";
import { Button } from "@mui/material";

function UserActions({ userId }) {
  const handleAddTask = () => {
    const taskDescription = prompt("Enter task description:");
    if (taskDescription) {
      axios
        .post("http://localhost:5000/api/tasks", {
          description: taskDescription,
          user_id: userId,
        })
        .then((response) => {
          alert("Task added successfully!");
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    }
  };

  const handleProcessTasks = () => {
    axios
      .post(`http://localhost:5000/api/users/${userId}/process_tasks`)
      .then((response) => {
        alert("Tasks processed successfully!");
      })
      .catch((error) => {
        console.error("Error processing tasks:", error);
      });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleAddTask}>
        Add Task
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleProcessTasks}
      >
        Process Next Task
      </Button>
    </div>
  );
}

export default UserActions;
