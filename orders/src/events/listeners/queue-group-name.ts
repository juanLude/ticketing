export const queueGroupName = "orders-service";
// This is the name of the queue group for the orders service
// It is used to ensure that all listeners in the same queue group receive messages from the same subject
// This allows for load balancing and ensures that only one instance of the listener processes a message at a time
// This is also used to ensure that the messages are processed in order
