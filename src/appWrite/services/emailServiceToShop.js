import conf from '../../conf/conf.js';
import { Client, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(conf.appwriteShopsProjectId);

const functions = new Functions(client);

const handleSendEmail = async (to, type,orderId,title,address,quantity,price,discountedPrice,phoneNumber,image) => {
  const emailBody = JSON.stringify({
    to: to,
    type,
    orderId,title,address,quantity,price,discountedPrice,phoneNumber,image
  });console.log(emailBody,"body")
  try {
    const result = await functions.createExecution(
      '678f6501000fad7c34c5',
      emailBody, 
      false,
      "/sendmail"
    );
    console.log('Execution result:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    console.log("email")
  }
};

export default handleSendEmail;
