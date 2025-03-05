import { Client, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject("6703b6cf0021226113b9");

const functions = new Functions(client);

const handleSendEmail = async ({to,type,orderId,orderDetails,address,phoneNumber}) => {
  const emailBody = JSON.stringify({
    to: to,
    type,
    orderId,orderDetails,address,phoneNumber
  });
  try {
    const result = await functions.createExecution(
      '678f6501000fad7c34c5',
      emailBody, 
      false,
      "/sendmail"
    );
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    console.log("email")
  }
};

export default handleSendEmail;
