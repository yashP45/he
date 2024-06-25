import { Request, Response } from 'express';
import Product, { IProduct } from '../models/product';

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  const { name, quantity, rate } = req.body;
  const userId = req.user.id;

  try {
    const product: IProduct = new Product({ userId, name, quantity, rate });
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send({ message: 'Error adding product' });
  }
};
