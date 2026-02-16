export interface ITaskItem {
  _id: string;
  name: string;
  todoId: string;
  favourite: boolean;
}

export interface ICreateTask {
  name: string;
  todoId: string;
  favourite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateTask {
  _id: string;
  name?: string;
  todoId?: string;
  favourite?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
