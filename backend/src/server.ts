import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import textRouter from './routes/text';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/text', textRouter);

app.get('/', (req, res) => {
  res.send('¡Backend de ReadRealJapanese listo!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));