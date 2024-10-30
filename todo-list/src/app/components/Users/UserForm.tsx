"use client";

import React, { useState } from "react";
import axios from "axios";
import { CreateUserDto } from "@/user/dtos/dtos/user.dto";
import useAuthStore from "@/app/store/authToken/authTokenStore";

const UserRegistration: React.FC = () => {
  const { setUserId, setToken } = useAuthStore();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [newUser, setNewUser] = useState<CreateUserDto>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!isLogin) {
        const response = await axios.post("http://localhost:3000/users", {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        });
        if (response) {
          setNewUser({ name: "", email: "", password: "" });
          console.log("Usuario creado con éxito:", response.data);
        }
      }

      if (isLogin) {
        const loginData = {
          email: newUser.email,
          password: newUser.password,
        };

        const response = await axios.post(
          "http://localhost:3000/users/login",
          loginData
        );

        if (response) {
          console.log(response.data);

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
          setToken(response.data.token);
          setUserId(response.data.userId);

          setNewUser({ name: "", email: "", password: "" });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al crear el usuario o iniciar sesión.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Iniciar Sesión" : "Registro de Usuario"}
        </h1>
        <form onSubmit={handleCreateUser} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLogin ? "Iniciar Sesión" : "Crear Usuario"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin((prev) => !prev)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          {isLogin ? "Registrarse" : "Ya tienes una cuenta? Inicia sesión"}
        </button>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default UserRegistration;
