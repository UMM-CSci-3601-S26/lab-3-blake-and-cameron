export interface Todo {
  _id: string;
  owner: string;
  status: boolean;
  body: string;
  category: todoCategory;
}

export type todoCategory = 'video games' | 'software design' | 'groceries' | 'homework';
