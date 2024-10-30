"use client";

import UserForm from "./components/Users/UserForm";
import TableToDolist from "./components/todoList/TodoList";
import useAuthStore from "./store/authToken/authTokenStore";

export default function Home() {
  const { token } = useAuthStore();
  const storedToken = localStorage.getItem("token");
  return <div>{token || storedToken ? <TableToDolist /> : <UserForm />}</div>;
}
