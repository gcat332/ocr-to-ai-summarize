import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function summarizeText(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    คุณคือผู้ช่วยอัจฉริยะในการอ่านข้อมูลจากใบเสร็จ (ซึ่งได้มาจาก OCR และอาจมีข้อผิดพลาดเล็กน้อย)

    กรุณาวิเคราะห์และแยกข้อมูลจากข้อความใบเสร็จด้านล่างให้อยู่ในรูปแบบ JSON ที่ตรงกับโครงสร้างต่อไปนี้:

    {
      "id": "", // ถ้าไม่มีให้เว้นว่าง
      "date": "วันที่ (เช่น 2025-06-18 หรือในรูปแบบที่พบในใบเสร็จ)",
      "currency": "สกุลเงิน เช่น THB หรือ ฿",
      "vendor_name": "ชื่อร้านค้า",
      "receipt_items": [
        {
          "item_name": "ชื่อสินค้า",
          "item_quantity": "จำนวนสินค้า",
          "item_cost": "ราคาสินค้า" หากเป็นของแถม หรือมูลค่า 0.00 ให้บอกว่า Free
        }
      ],
      "tax": "ภาษี (ถ้ามี)",
      "discount": "ส่วนลด (ถ้ามี)",
      "total": "ราคารวม",
      "payment_method": "วิธีชำระเงิน (ถ้ามี)",
      "notes": "หมายเหตุเพิ่มเติม เช่น คำขอบคุณ เบอร์โทรศัพท์ หรือข้อมูลอื่น ๆ"
    }

    - ถ้าข้อมูลบางอย่างไม่พบ ให้เว้นว่าง ("")
    - หากมีข้อมูลที่คาดว่าไม่ใช่สินค้า เช่น Sub-Total, Promotion ไม่ต้องใส่ใน Receipt_items
    - อย่าใส่ Markdown block หรือคำอธิบายใด ๆ เพิ่มเติม
    - ตอบกลับเป็น JSON เท่านั้น

    ข้อความใบเสร็จที่จะวิเคราะห์:

    ${text}
  `;
  const result = await model.generateContent(prompt);
  const response = result.response.candidates[0].content.parts[0].text;
  return unwrapAndParseJson(response);
}

// clean markdown
function unwrapAndParseJson(raw) {
  try {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json') || cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json|```/gi, '').trim();
    }
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = JSON.parse(cleaned); 
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('JSON cleaning Error:', err.message);
    return null;
  }
}