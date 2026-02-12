import { handleApiResponse } from "./types";

export interface IItem {
  _id: string;
  name: string;
}

const API_BASE = import.meta.env.VITE_API_URL;
const TODO_API_URL = `${API_BASE}/todo`;

export const todoApiService = {
  async getAll(): Promise<IItem[]> {
    const res = await fetch(TODO_API_URL);

    return handleApiResponse<IItem[]>(res);
  },

  async create(name: string): Promise<IItem> {
    const res = await fetch(`${TODO_API_URL}/add-new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    return handleApiResponse(res);
  },

  async update(id: string, name: string): Promise<IItem> {
    const res = await fetch(`${TODO_API_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, name }),
    });

    return handleApiResponse<IItem>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${TODO_API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete");
    }
  },
};
