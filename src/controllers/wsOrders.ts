import * as WebSocket from "ws";
import Order from '../models/orders';
import { getUserIdFromToken } from "../middlewares/auth-thunk";

interface MatchCriteria {
  'owner.ownerId'?: string;
};

export async function buildOrderResponse(userId?: string | null) {
  try {
    let matchCriteria: MatchCriteria = {};

    if (userId) {
      matchCriteria["owner.ownerId"] = userId;
    }

    const orders = await Order.aggregate([
      {
        $match: matchCriteria
      },
      {
        $addFields: {
          ingredients: {
            $map: {
              input: "$ingredients",
              as: "ingredient",
              in: "$$ingredient._id",
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
      {
        $project: {
          price: 0,
          owner: 0
        }
      }
    ]);

    const total = orders.length;
    const totalToday = orders.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).length;

    return {
      success: true,
      total,
      totalToday,
      orders,
    };

  } catch (err) {
    return { error: 'An error occurred while fetching orders' };
  }
};

export const handleOrdersAll = async (ws: WebSocket) => {
  ws.on('message', (data) => {
    console.log('New message on /orders: ' + data);
  });
  const response = await buildOrderResponse();
  ws.send(JSON.stringify(response));
};

export const handleOrders = async (ws: WebSocket, token: string) => {
  ws.on('message', (data) => {
    console.log('New message on /orders: ' + data);
  });

  const userId = getUserIdFromToken(token);
  const response = await buildOrderResponse(userId)
  ws.send(JSON.stringify(response));
};
