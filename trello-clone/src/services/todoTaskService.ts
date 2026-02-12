import { handleApiResponse } from "./types";

export interface ITaskItem {
  _id: string;
  name: string;
  todoId: string;
}

export interface ICreateTask {
  name: string;
  todoId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const API_BASE = import.meta.env.VITE_API_URL;
const TOTO_TASK_URL = `${API_BASE}/todo-task`;

export const todoTaskService = {
  async getAll(id: string | undefined): Promise<ITaskItem[]> {
    if (!!id && id.trim() !== "") {
      const res = await fetch(`${TOTO_TASK_URL}?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      return handleApiResponse<ITaskItem[]>(res);
    }

    throw new Error("Id must be nedded");
  },

  async createTodoTask(req: ICreateTask): Promise<ITaskItem> {
    const res = await fetch(`${TOTO_TASK_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    return handleApiResponse(res);
  },
};
