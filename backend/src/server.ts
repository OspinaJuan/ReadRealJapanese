import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/analyze", analyzeRouter);

app.get('/', (req, res) => {
  res.send('¡Backend de ReadRealJapanese listo!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));