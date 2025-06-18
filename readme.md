# 🧾 OCR Receipt Summarizer API (with Gemini)

A lightweight Node.js server that takes receipt images (in binary), performs OCR (Optical Character Recognition), and summarizes the content into clean JSON format using Google Gemini AI.

---

## 🚀 Features

- 🔍 OCR using `tesseract.js` (Thai + English)
- 🧠 Summarization using **Gemini 2.0 Flash** via Google Generative AI
- 🖼️ Accepts image as binary stream (not multipart)
- 📦 Returns summarized result in structured **JSON format**

---

## 📁 Project Structure

```
.
├── server.js               # Express server to receive and handle image upload
├── functions/
│   ├── ocrProcess.js       # OCR function using tesseract.js
│   └── summarizeText.js    # Gemini API logic with prompt & JSON parsing
├── .env                    # Gemini API key
├── uploads/                # Temporary storage for uploaded images
```

---

## 📦 Requirements

- Node.js 18+
- Google Generative AI API Key (Gemini)

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## 🚀 Running the Server

```bash
node server.js
```

Server will run on: `http://localhost:3000`

---

## 📤 Uploading a Receipt Image

Send a `POST` request to `/bill_sum` with **binary image** (e.g. JPG/PNG) as raw body.

### Example (using `curl`):

```bash
curl -X POST http://localhost:3000/bill_sum   --header "Content-Type: image/jpeg"   --data-binary "@your_receipt.jpg"
```

### Example Response:

```json
{
  "store_name": "7-Eleven",
  "date_time": "01-06-2025 12:34",
  "items": [
    {
      "name": "น้ำดื่ม",
      "quantity": "1",
      "unit_price": "10.00",
      "total_price": "10.00"
    }
  ],
  "total_amount": "10.00",
  "vat": "",
  "payment_method": "เงินสด",
  "notes": "ขอบคุณที่ใช้บริการ"
}
```

---

## 🧠 Prompt Logic

The prompt instructs Gemini to:
- Extract fields like store name, date, item list, total, VAT, etc.
- Return only a pure JSON object (no Markdown or explanation)
- Tolerate minor OCR errors

---

## ⚠️ Notes

- If OCR returns poor results, try high-res images
- Works best on Thai-English printed receipts
- You can extend this to support multipart/form-data if needed

---

## 📄 License

MIT — enjoy hacking!

---

Made with ❤️ by แมวไทย 🐾