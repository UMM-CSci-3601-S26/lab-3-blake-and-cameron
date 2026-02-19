export interface Todo {
  _id: string;
  owner: string;
  status: number;
  body: string;
  category: string;
}

export type todoCategory = 'video games' | 'software design' | 'groceries' | 'homework';
