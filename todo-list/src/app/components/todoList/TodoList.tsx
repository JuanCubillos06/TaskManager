"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "@/app/store/authToken/authTokenStore";
import { text } from "stream/consumers";
import { title } from "process";
import { describe } from "node:test";
import { TaskStatus } from "@/common/enums";
import { Task } from "@/app/utils/interfaces/task.interface";
import Swal from "sweetalert2";

const TableToDolist = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameTask, setNameTask] = useState<string>("");
  const [descriptionTask, setDescriptionTask] = useState<string>("");
  const [token, setToken] = useState<string | null>("");
  const { clearToken } = useAuthStore();

  const [userId, setUserId] = useState<string | null>("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    if (!token) {
    }
  }, [token]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskResponse = await axios.get(
          `http://localhost:3000/tasks/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (taskResponse) {
          setTasks(taskResponse?.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTask();
  }, [token]);

  const handleAddTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newTaskSend = await axios.post(
      "http://localhost:3000/tasks",
      {
        title: nameTask,
        description: descriptionTask,
        assignedUser: Number(userId),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (newTaskSend) {
      Swal.fire({
        title: "Task Created",
        icon: "success",
      });
    }
    setTasks([...(tasks || []), newTaskSend.data]);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:3000/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Task Deleted",
          icon: "success",
        });
        setTasks((prevTasks = []) =>
          prevTasks.filter((task) => task.id !== id)
        );
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const { id, ...newUpdatedTask } = updatedTask;

      const response = await axios.put(
        `http://localhost:3000/tasks/${updatedTask.id}`,
        newUpdatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Task Updated",
          icon: "success",
        });
        console.log("Update", response);

        setTasks((prevTasks) =>
          prevTasks?.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      } else {
        console.error("Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    clearToken();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <button onClick={logOut} className=" rounded">
        Log Out
      </button>
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Task List</h1>
      <form className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title Task"
            minLength={10}
            onChange={(e) => setNameTask(e.target.value)}
            required
            className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Description Task"
            minLength={10}
            onChange={(e) => setDescriptionTask(e.target.value)}
            required
            className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={(e) => handleAddTask(e)}
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
        >
          Add Task
        </button>
      </form>

      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600">
              <th className="px-6 py-3 text-white font-semibold text-left">
                Task Name
              </th>
              <th className="px-6 py-3 text-white font-semibold text-left">
                Description
              </th>
              <th className="px-6 py-3 text-white font-semibold text-left">
                Status
              </th>
              <th className="px-6 py-3 text-white font-semibold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks &&
              tasks.map((task, index) => (
                <tr
                  key={task.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-100`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      defaultValue={task.title}
                      onBlur={(e) =>
                        handleUpdateTask({ ...task, title: e.target.value })
                      }
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      defaultValue={task.description}
                      onBlur={(e) =>
                        handleUpdateTask({
                          ...task,
                          description: e.target.value,
                        })
                      }
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateTask({
                          ...task,
                          status: e.target.value as TaskStatus,
                        })
                      }
                      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(TaskStatus).map((status) => {
                        const formattedStatus = status
                          .replace("_", " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase());

                        return (
                          <option key={status} value={status}>
                            {formattedStatus}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableToDolist;
