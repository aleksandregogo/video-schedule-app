import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tls from 'tls';
import * as fs from 'fs';
import * as protobuf from '../../TCPClient/Protobuf/compiled';
import { ConfigService } from '@nestjs/config';

const ClientRequest = protobuf.example.ClientRequest;
const ServerResponse = protobuf.example.ServerResponse;

@Injectable()
export class AppService implements OnModuleInit {
  private tcpHost: string;
  private tcpPort: number;
  private tlsOptions: tls.TlsOptions;

  constructor(private readonly configService: ConfigService) {
    this.tcpHost = this.configService.get<string>('TCP_SERVER_HOST', '0.0.0.0');
    this.tcpPort = this.configService.get<number>('TCP_SERVER_PORT', 3033);

    this.tlsOptions = {
      key: fs.readFileSync(process.env.TCP_SERVER_KEY_PATH),
      cert: fs.readFileSync(process.env.TCP_SERVER_CERT_PATH),
      ca: fs.readFileSync(process.env.TCP_SERVER_CA_PATH),
    };
  }

  onModuleInit() {
    console.log(`Starting secure TCP server on ${this.tcpHost}:${this.tcpPort}`);

    // Create a secure TCP server with TLS
    const server = tls.createServer(this.tlsOptions, (socket) => {
      console.log('New client connected (TLS)');

      // Handle incoming data
      socket.on('data', (buffer) => {
        try {
          console.log('Received data from client:', buffer);

          // Decode the Protobuf message
          const clientRequest = ClientRequest.decode(buffer);
          console.log('Decoded client request:', clientRequest);

          // Create a Protobuf response
          const response = ServerResponse.create({
            message: `Hello, ${clientRequest.clientId}! You sent: ${clientRequest.message}`,
            timestamp: new Date().toISOString(),
          });

          // Encode and send the response
          const encodedResponse = ServerResponse.encode(response).finish();
          socket.write(encodedResponse);
        } catch (error) {
          console.error('Error processing data:', error);
        }
      });

      // Handle connection close
      socket.on('close', () => {
        console.log('Client disconnected');
      });

      // Handle socket errors
      socket.on('error', (err) => {
        console.error('Socket error:', err);
      });
    });

    // Start the secure TCP server
    server.listen(this.tcpPort, this.tcpHost, () => {
      console.log(`Secure TCP server listening on ${this.tcpHost}:${this.tcpPort}`);
    });
  }
}
