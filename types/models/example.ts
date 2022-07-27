export interface Example {
  id: string,
  items: string[],
  status: 'online' | 'offline'
};

export type ExampleRequestParams = Pick<Example, "items" | "status">;
