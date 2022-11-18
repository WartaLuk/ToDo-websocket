// import io from "socket.io";
import { useEffect, useState } from "react";
import randomID from "@warta/randomid--enerator";
import io from "socket.io-client";

const App = () => {
  const rId = randomID(20);
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const validateEr = false;

  useEffect(() => {
    const socket = io(process.env.NODE_ENV === "production" ? "" : 'ws://localhost:8000', { transports: ["websocket"] });
    
    setSocket(socket);
    socket.on("updateData", (tasks) => {
      updateTasks(tasks);
    });

    socket.on("addTask", (task) => {
      addTask(task);
    });

    socket.on("removeTask", (id) => {
      removeTask(id);
    });
  }, []);

  const removeTask = (id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  const submitForm = (e) => {
    e.preventDefault();
    const task = { name: taskName, id: randomID(rId) };
      addTask(task);
      socket.emit("addTask", task);
      setTaskName("");
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
    setTaskName("");
  };

  const updateTasks = (tasksData) => {
    setTasks(tasksData);
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task">
              {task.name}
              <button
                className="btn btn--red"
                onClick={() => removeTask(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={(e) => submitForm(e)}>
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="text-input"
            autocomplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
