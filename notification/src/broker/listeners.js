const { sendEmail } = require("../email");
const { subscribeToQueue } = require("./broker");
const { addNotification } = require("../store");

module.exports = function () {
  subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
    const emailHTMLTemplate = `
        <h1>Welcome to our service!</h1>
        <p>Dear ${
          data.fullName.firstName + " " + (data.fullName.lastName || "")
        },</p>
        <p>Thank you for registering with us. We are excited to have you on board!</p>
        <p>Best regards,<br/>The Team</p>
`;

    await sendEmail(
      data.email,
      "Welcome to Our Service",
      "Thank you for registering with us!",
      emailHTMLTemplate
    );

    // store a notification
    try { addNotification({ message: `Welcome ${data.fullName.firstName}`, data }) } catch (e) {}
  });

  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_INITIATED", async (data) => {
    const emailHTMLTemplate = `
        <h1>Payment Initiated!</h1>
        <p>Dear ${data.username},</p>
        <p>Your payment of ${data.currency} ${data.amount} for the order ID: ${data.orderId} has been initiated.</p>
        <p>We will notify you once the payment is completed.</p>
        <p>Best regards,<br/>The Team</p>
  `;

    await sendEmail(
      data.email,
      "Payment Initiated!",
      "Your payment is being processed.",
      emailHTMLTemplate
    );

    try { addNotification({ message: `Payment initiated for order ${data.orderId}`, data }) } catch (e) {}
  });

  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
    const emailHTMLTemplate = `
        <h1>Payment successful!</h1>
       <p>Dear ${data.username},</p>
        <p>We have recieved your payment of ${data.currency} ${data.amount} for the order ID: ${data.orderId}.</p>
         <p>Thank you for your purchase!</p>
        <p>Best regards,<br/>The Team</p>
  `;

    await sendEmail(
      data.email,
      "Payment Successful!",
      "We have recieved your payment.",
      emailHTMLTemplate
    );

    try { addNotification({ message: `Payment received for order ${data.orderId}`, data }) } catch (e) {}
  });

  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", async (data) => {
    const emailHTMLTemplate = `
        <h1>Payment failed!</h1>
        <p>Dear ${data.username},</p>
        <p>Unfortunately, your payment for the order ID: ${data.orderId} has failed.</p>
         <p>Please try again or contact support if the issue persists.</p>
        <p>Best regards,<br/>The Team</p>
  `;

    await sendEmail(
      data.email,
      "Payment Failed!",
      "Your payment could not be processed.",
      emailHTMLTemplate
    );

    try { addNotification({ message: `Payment failed for order ${data.orderId}`, data }) } catch (e) {}
  });

  subscribeToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", async (data) => {
    const emailHTMLTemplate = `
        <h1>New Product available!</h1>
        <p>Dear ${data.username},</p>
        <p>Check it out and enjoy exclusive launch offers!</p>
        <p>Best regards,<br/>The Team</p>
  `;

    await sendEmail(
      data.email,
      "New Product Launched!",
      "Check out our latest product.",
      emailHTMLTemplate
    );

    try { addNotification({ message: `New product: ${data.title || data.name || ''}`, data }) } catch (e) {}
  });
};
