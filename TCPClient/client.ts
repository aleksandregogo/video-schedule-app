import * as tls from 'tls'; // Use the `tls` module for secure connections
import * as fs from 'fs';
import * as protobuf from './Protobuf/compiled'; // Adjust the path to your Protobuf bindings

const ClientRequest = protobuf.example.ClientRequest;
const ServerResponse = protobuf.example.ServerResponse;

// TLS options for the client
const sslOptions = {
  key: fs.readFileSync('./Certs/Client/client.key'), // Client private key
  cert: fs.readFileSync('./Certs/Client/client.crt'), // Client certificate
  ca: fs.readFileSync('./Certs/Root/ca.crt'), // Root CA certificate
};

console.log('TLS options loaded:', sslOptions);

// Create a secure connection to the server using `tls.connect`
const client = tls.connect(
  {
    host: '127.0.0.1', // Server host
    port: 3033, // Server port
    ...sslOptions, // Include TLS options
  },
  () => {
    console.log('Connected to secure TCP server');

    // Create a Protobuf message
    const message = ClientRequest.create({
      message: 'Hello, Secure Server!',
      clientId: 'SecureClient1',
    });

    // Encode the Protobuf message into a binary buffer
    const buffer = ClientRequest.encode(message).finish();
    console.log('Sending encoded message to server:', buffer);

    // Send the message
    client.write(buffer);
  }
);

// Handle data received from the server
client.on('data', (data) => {
  try {
    // Decode the Protobuf response from the server
    const response = ServerResponse.decode(data);
    console.log('Received from server:', response);
    client.end(); // Close the connection after receiving a response
  } catch (error) {
    console.error('Error decoding server response:', error);
  }
});

// Handle connection close
client.on('close', () => {
  console.log('Connection closed');
});

// Handle connection errors
client.on('error', (err) => {
  console.error('Connection error:', err);
});