import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import schemaRoutes from './routes/schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', schemaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SchemaLens Backend Running ⚡' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});