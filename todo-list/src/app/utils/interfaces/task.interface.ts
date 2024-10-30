import { TaskStatus } from "@/common/enums";

export interface Task {
  id: string;
  title: string;
  assignedUser: string;
  description: string;
  status: TaskStatus;
}
