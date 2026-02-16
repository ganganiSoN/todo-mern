import { handleApiResponse } from "../../shared/lib/types";
import type { ICreateTask, ITaskItem, IUpdateTask } from "./todoList.types";

const API_BASE = import.meta.env.VITE_API_URL;
const TODO_TASK_URL = `${API_BASE}/todo-task`;

export const todoTaskService = {
  async getAll(id: string | undefined): Promise<ITaskItem[]> {
    if (!!id && id.trim() !== "") {
      const res = await fetch(`${TODO_TASK_URL}?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      return handleApiResponse<ITaskItem[]>(res);
    }

    throw new Error("Id must be nedded");
  },

  async createTodoTask(req: ICreateTask): Promise<ITaskItem> {
    const res = await fetch(`${TODO_TASK_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    return handleApiResponse(res);
  },

  async updateTodoTask(req: IUpdateTask): Promise<ITaskItem> {
    const res = await fetch(`${TODO_TASK_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    return handleApiResponse(res);
  },

  async updateFavourite(req: IUpdateTask): Promise<ITaskItem> {
    const res = await fetch(`${TODO_TASK_URL}/favourite`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: req._id, favourite: req.favourite }),
    });

    return handleApiResponse(res);
  },

  async deleteTodoTask(req: ITaskItem): Promise<ITaskItem> {
    const res = await fetch(`${TODO_TASK_URL}/${req._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    return handleApiResponse(res);
  },
};
