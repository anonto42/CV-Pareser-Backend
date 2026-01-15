import { createApp } from './app';
import config from '../../shared/infrastructure/config';

async function main() {
  try {

    const server = createApp();
    
    server.listen(
      config.server.port,
      config.server.host,
      () => console.log(`Server is running on port ${config.server.port}`)
    );

  } catch (error) {
    process.exit(1);
  }
}

main();