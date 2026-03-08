---
description: How to deploy updates to Vercel
---

# Deploy to Vercel

เมื่อแก้โค้ดเสร็จแล้วอยาก Deploy ให้ทำตามขั้นตอนนี้ทุกครั้ง:

## Step 1: เก็บไฟล์เข้า Git
```bash
git add .
```

## Step 2: ตั้งชื่อให้การอัปเดตรอบนี้
```bash
git commit -m "ใส่ข้อความอธิบายสั้นๆ ว่าแก้อะไร"
```
ตัวอย่าง:
- `git commit -m "Fix form contrast"`
- `git commit -m "Add image upload feature"`

## Step 3: ส่งขึ้น GitHub (Vercel จะ Auto Deploy ให้)
```bash
git push
```

## Step 4: รอ Vercel Build
- เปิดเว็บ https://vercel.com → เข้าโปรเจกต์ `cm-real-estate`
- กดแถบ **Deployments**
- รอจนสถานะขึ้น **Ready** (ไฟเขียว) ประมาณ 1-2 นาที

## Step 5: ทดสอบ
- กดปุ่ม **Visit** มุมขวาบน หรือเข้า https://cm-real-estate.vercel.app
- เช็คว่าสิ่งที่แก้ไขทำงานถูกต้อง

> **หมายเหตุ:** ถ้าเพิ่ม Environment Variable ใหม่ (เช่น Cloudinary, API Key ต่างๆ) ต้องไปเพิ่มใน Vercel ด้วย:
> Settings → Environment Variables → เพิ่ม Key/Value → Save → แล้ว Redeploy
