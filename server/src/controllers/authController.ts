import { Request, Response } from "express";
import User, { IUser } from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const user: IUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();
    res.status(201).send({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).send({ message: "Error registering user", err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).send({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      "your_jwt_secret"
    );
    res.send({ token });
  } catch (err) {
    res.status(500).send({ message: "Error logging in" });
  }
};
