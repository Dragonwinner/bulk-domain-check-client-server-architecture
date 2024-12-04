import cors from 'cors';

export const configureCors = (app) => {
  app.use(cors({
    origin: 'http://localhost:5173', // Vite's default port
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  }));
};