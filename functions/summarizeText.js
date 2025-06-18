import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function summarizeText(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
        คุณคือผู้ช่วยอัจฉริยะในการอ่านข้อมูลจากใบเสร็จ (ซึ่งได้มาจาก OCR และอาจมีข้อผิดพลาดเล็กน้อย)

        กรุณาวิเคราะห์และแยกข้อมูลจากข้อความใบเสร็จด้านล่างให้อยู่ในรูปแบบ JSON ที่เหมาะกับมนุษย์อ่านได้ โดยไม่มี Markdown block มาครอบ โดยมีโครงสร้างดังนี้:

        {
        "store_name": "ชื่อร้านค้า (ถ้ามี)",
        "date_time": "วันที่และเวลา (ถ้ามี)",
        "items": [
            {
            "name": "ชื่อสินค้า",
            "quantity": "จำนวน",
            "unit_price": "ราคาต่อหน่วย",
            "total_price": "ราคารวมต่อรายการ"
            }
        ],
        "total_amount": "ยอดรวมทั้งหมด",
        "vat": "ภาษีมูลค่าเพิ่ม (ถ้ามี)",
        "payment_method": "วิธีชำระเงิน (ถ้ามี)",
        "notes": "หมายเหตุเพิ่มเติม เช่น คำขอบคุณ เบอร์โทรศัพท์ หรือข้อมูลอื่น ๆ"
        }

        หากข้อมูลบางรายการไม่สามารถระบุได้แน่ชัด ให้เว้นค่าว่าง ("") แทน

        โปรดอย่าใส่คำอธิบายใด ๆ เพิ่มเติม นอกจาก JSON เท่านั้น

        ข้อความใบเสร็จที่ต้องวิเคราะห์มีดังนี้:

        ${text}
    `;
  const result = await model.generateContent(prompt);
  const response = result.response.candidates[0].content.parts[0].text;
  return unwrapAndParseJson(response);
}

function unwrapAndParseJson(raw) {
  try {
    // 1. Remove markdown block like ```json ... ```
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json') || cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json|```/gi, '').trim();
    }

    // 2. Check if cleaned is a quoted JSON string (stringified string)
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      // Remove wrapping quotes, then unescape
      cleaned = JSON.parse(cleaned); // Now it's a real JSON string
    }

    // 3. Parse final JSON
    return JSON.parse(cleaned); // Now should be the real object
  } catch (err) {
    console.error('❌ ไม่สามารถแปลง JSON ได้:', err.message);
    return null;
  }
}