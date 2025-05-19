export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          // Simulate successful publishment of an event
          callback();
        }
      ),
  },
};
