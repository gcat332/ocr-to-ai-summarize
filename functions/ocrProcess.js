import Tesseract from 'tesseract.js';

export async function ocrProcess(imagePath) {
  const result = await Tesseract.recognize(imagePath, 'tha+eng');
  return result.data.text;
}