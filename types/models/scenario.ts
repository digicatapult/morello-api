import { ExecException } from "child_process";

// todo if it gets bigger group in models/ folder by entity and import here or ambient namescapes
type Response = {
  status: 'success' | 'error',
  output: string | ExecException, 
}

export interface ExamplesResult {
  morello: Response,
  self: Response,
}
