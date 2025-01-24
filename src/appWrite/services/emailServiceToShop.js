import conf from '../conf/conf.js';
import { Client, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(conf.appwriteShopsProjectId);

const functions = new Functions(client);

const handleSendEmail = async (to, subject, text) => {
  // States for handling status and sending flag
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  setSending(true);
  setStatus('');

  // Creating a stringified email body with dynamic input
  const emailBody = JSON.stringify({
    to: to,
    subject: subject,
    text: text,
  });

  try {
    const result = await functions.createExecution(
      '678f6501000fad7c34c5', // functionId
      emailBody, // sending the stringified body
      false // async (optional)
    );
    console.log('Execution result:', result); // Log the result for debugging
    setStatus('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error); // Log the error for debugging
    setStatus('Failed to send email: ' + error.message);
  } finally {
    setSending(false);
  }
};

export default handleSendEmail;
