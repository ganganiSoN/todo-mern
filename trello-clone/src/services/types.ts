export type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};

export async function handleApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || "API Error");
    } catch (error) {
      throw new Error(text || "API Error");
    }
  }

  const json = (await res.json()) as ApiResponse<T>;

  return json.data as T;
}
