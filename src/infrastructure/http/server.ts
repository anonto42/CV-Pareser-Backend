import { Application } from 'express';
import { createApp } from './app';
import config from '../config';

async function main() {
  try {

    const server = createApp();
    
    server.listen(
      config.port,
      config.host,
      () => console.log(`Server is running on port ${config.port}`)
    );

  } catch (error) {
    process.exit(1);
  }
}

main();