import React, { useState } from 'react';
import { Client, Functions, ExecutionMethod } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject('6703b6cf0021226113b9'); // Your project ID

const functions = new Functions(client);

const Email = () => {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const handleSendEmail = async () => {
    setSending(true);
    setStatus('');

    // Creating a stringified email body
    const emailBody = JSON.stringify({
      to: 'motofirstmy@gmail.com',
      subject: 'YOU HAVE A NEW ORDER',
      text: 'HURRY UP YOU HAVE A NEW ORDER',
    });

    try {
      const result = await functions.createExecution(
        '678f6501000fad7c34c5', // functionId
        emailBody, // sending the stringified body
        false, // async (optional)
        '/sendmail', // path (optional)
        ExecutionMethod.POST, 
      );
      setStatus('Email sent successfully!');
    } catch (error) {
      setStatus('Failed to send email: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Send Email</h1>
      <button
        onClick={handleSendEmail}
        disabled={sending}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: sending ? 'not-allowed' : 'pointer',
        }}
      >
        {sending ? 'Sending...' : 'Send Test Email'}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Email;
