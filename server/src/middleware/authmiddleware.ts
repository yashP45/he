import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IUserPayload {
  id: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: IUserPayload;
  }
}

export default (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as IUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ message: 'Invalid token' });
  }
};
