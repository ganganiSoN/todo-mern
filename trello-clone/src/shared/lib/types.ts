export type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};

export async function handleApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = "API Error";
    try {
      const json = JSON.parse(text);
      message = json.message || message;
    } catch (error) {
      message = text || message;
    }

    throw new Error(message);
  }

  const json = (await res.json()) as ApiResponse<T>;

  return json.data as T;
}
