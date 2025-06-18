import express from 'express';
import fs from 'fs';
import path from 'path';
import { ocrProcess } from './functions/ocrProcess.js';
import { summarizeText } from './functions/summarizeText.js';

const app = express();
const port = 3000;


app.use('/bill_sum', express.raw({ type: '*/*', limit: '10mb' }));
app.post('/bill_sum', async (req, res) => {
  try {
    const buffer = req.body;
    const fileName = `upload-${Date.now()}.jpg`;
    const filePath = path.join('uploads', fileName);
    fs.writeFileSync(filePath, buffer);

    const text = await ocrProcess(filePath);
    const summary = await summarizeText(text);

    fs.unlinkSync(filePath);
    res.json(summary);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Binary Upload Failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
