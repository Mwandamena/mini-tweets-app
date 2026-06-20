declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        exp: number;
        iat: number;
      };
      token: string;
    }
  }
}
export {};
