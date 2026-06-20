import jwt from "jsonwebtoken";

export function verifyToken(token: string): any {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment vairables");
  }
  const jwtSecret = process.env.JWT_SECRET || "appleberry";
  return jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      console.log(
        "[INFO ~ AuthService]: Token verification failed ",
        err.message
      );
      return null;
    } else {
      console.log("[INFO ~ AuthService]: Token verification successful");
      return decoded;
    }
  });
}
