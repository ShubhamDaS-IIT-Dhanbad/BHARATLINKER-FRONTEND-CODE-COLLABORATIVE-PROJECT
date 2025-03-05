import { Client, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject("6703b6cf0021226113b9");

const functions = new Functions(client);

const handleSendEmail = async ({ to, type, orderDetails, address, phoneNumber }) => {
  // Ensure orderDetails is an array of order IDs or objects
  const emailBody = JSON.stringify({
    to,
    type,
    orderDetails, // Can be an array of order IDs or detailed objects
    address,
    phoneNumber
  });

  try {
    console.log("Sending email with data:", emailBody); // Debug log

    const result = await functions.createExecution(
      '678f6501000fad7c34c5',
      emailBody,
      false
    );

    console.log('Email function execution result:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    console.log("Email function execution attempted");
  }
};

export default handleSendEmail;
