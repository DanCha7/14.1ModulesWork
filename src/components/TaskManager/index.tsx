import React, { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "../task";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(
          "https://b7286e1ae84d54d9.mokky.dev/list"
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const task: Task = { title: newTask, completed: false, id: Date.now() };

    try {
      const response = await axios.post<Task>(
        "https://b7286e1ae84d54d9.mokky.dev/list",
        task
      );
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`https://b7286e1ae84d54d9.mokky.dev/list/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask: Task = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };
    // патч
    try {
      await axios.patch(
        `https://b7286e1ae84d54d9.mokky.dev/list/${id}`,
        updatedTask
      );
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  return (
    <div className="container">
      <div className="block__container__content">
        <h1>Список задач</h1>
        <form onSubmit={addTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Новая задача"
            required
          />
          <button className="submit__btn" type="submit">
            Добавить
          </button>
        </form>
        <ul>
          {tasks.map((task) => (
            <li className="list__item" key={task.id}>
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.title}
              </span>
              <button
                className="delete__btn"
                onClick={() => deleteTask(task.id)}
              >
                Х
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskManager;
