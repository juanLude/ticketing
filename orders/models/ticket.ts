import mongoose from "mongoose";
import { Order, OrderStatus } from "./order"; // Import the Order model

interface TicketAttrs {
  id: string; // This is the id of the ticket in the database
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>; // Method to check if the ticket is reserved
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // Transform the document before sending it as JSON
        // Remove the _id and __v fields from the JSON response
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, // Use the provided id as the _id of the document.
    // This is important for the ticket to be found by its id later.
    // Mongoose uses _id as the primary key, so we set it to the id provided in attrs
    title: attrs.title,
    price: attrs.price,
  });
};
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder; // Return true if an existing order is found
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
