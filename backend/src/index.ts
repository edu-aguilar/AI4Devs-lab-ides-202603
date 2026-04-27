import dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config();

const port = 3010;

const app = createApp();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});