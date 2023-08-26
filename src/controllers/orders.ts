import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Ingredient from '../models/ingredient';
import Order from '../models/orders';
import NotFoundError from '../errors/not_found_error';
import { buildOrderName } from '../utils/functions';
import { agenda, clients, userClients } from '../app';
import { buildOrderResponse } from '../controllers/wsOrders';

export const putAnOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ingredients } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    const ingredientsPromises = ingredients.map((id: string) => Ingredient.findById(id));
    const allingredients = await Promise.all(ingredientsPromises);

    const price = allingredients.reduce((total, ing) => total + ing.price, 0);

    const lastOrder = await Order.find().sort({ 'number': -1 }).limit(1);
    const orderNumber = lastOrder[0]?.number + 1 || 1;

    const orderName = buildOrderName(allingredients);

    if (!allingredients || allingredients.length === 0) {
      return next(new NotFoundError('Ingredients not found'));
    }

    const order = new Order({
      name: orderName,
      number: orderNumber,
      price: price,
      ingredients: allingredients,
      owner: {
        createdAt: user.createdAt,
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt,
        ownerId: user._id
      },
      status: "pending",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await order.save();

    const userWs = userClients.get(order.owner.ownerId!);
    if (userWs) {
      const response = await buildOrderResponse(order.owner.ownerId);
      userWs.send(JSON.stringify(response));
    }

    const response = await buildOrderResponse();
    clients.forEach(client => {
      client.send(JSON.stringify(response));
    });

    agenda.schedule('in 1 minute', 'updateOrderStatus', { orderId: order._id, userId: order.owner.ownerId });

    await agenda.start();

    const sendingOrder = {
      name: orderName,
      number: orderNumber,
      price: price,
      ingredients: allingredients,
      owner: {
        createdAt: user.createdAt,
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt,
      },
      status: "pending",
    };

    res.send({
      name: order.name,
      success: true,
      order: sendingOrder,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};
