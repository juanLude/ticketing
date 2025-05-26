import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../../models/order";
import { NotFoundError, requireAuth } from "@juanludetickets/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    //
    const order = await Order.findById(orderId).populate("ticket");
    // Check if the order exists and belongs to the user
    if (!order) {
      throw new NotFoundError();
    }
    // Check if the order belongs to the user
    if (order.userId !== req.currentUser!.id) {
      throw new NotFoundError();
    }

    order.status = OrderStatus.Cancelled; // Set the order status to Cancelled
    await order.save();

    // Publish an event to notify other services that the order was cancelled
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).send(order); // Send a 204 No Content response
  }
);

export { router as deleteOrderRouter };
