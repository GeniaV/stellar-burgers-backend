import * as WebSocket from "ws";
import Order from '../models/orders';

export const handleOrders = (ws: WebSocket, token?: string) => {
  ws.on('message', (data) => {
    console.log('New message on /orders: ' + data);
  });
  ws.send('Thanks for connecting to /orders');
};

export const handleOrdersAll = (ws: WebSocket) => {
  ws.on('message', (data) => {
    console.log('New message on /orders: ' + data);
  });

  const sendInitialOrders = () => {
    Order.aggregate([
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
    ])
      .then((orders) => {
        const total = orders.length;
        const totalToday = orders.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).length;
        const response = {
          success: true,
          total,
          totalToday,
          orders: orders,
        };

        ws.send(JSON.stringify(response));
      })
      .catch(err => {
        ws.send(JSON.stringify({ error: 'An error occurred while fetching orders' }));
      });
  };

  sendInitialOrders();
};


