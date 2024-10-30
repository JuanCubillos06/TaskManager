import axios from "axios";

import { User } from "@/entities/entities/user.entity";
import {
  CreateUserDto,
  UpdateUserDto,
  UserLoginDto,
} from "@/user/dtos/dtos/user.dto";
import { PaginationResult } from "@/common/interfaces";

const API_URL = "http://localhost:3000";

export const getAllUsers = async (
  page: number,
  limit: number
): Promise<PaginationResult<User>> => {
  const response = await axios.get<PaginationResult<User>>(API_URL, {
    params: { page, limit },
  });
  return response.data;
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/${userId}`);
  return response.data;
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const response = await axios.post<User>(`${API_URL}/users`, userData);
  console.log("response services", response);
  return response.data;
};

export const updateUser = async (
  userId: number,
  updateUserData: UpdateUserDto
): Promise<User> => {
  const response = await axios.patch<User>(
    `${API_URL}/${userId}`,
    updateUserData
  );
  return response.data;
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  const response = await axios.delete<boolean>(`${API_URL}/${userId}`);
  return response.data;
};

export const loginUser = async (
  userData: UserLoginDto
): Promise<{ token: string }> => {
  const response = await axios.post<{ token: string }>(
    `${API_URL}/users/login`,
    userData
  );
  return response.data;
};
