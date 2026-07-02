# Moment Garden Asset Guide

โครงสร้างนี้เตรียมไว้สำหรับเปลี่ยนเว็บจาก prototype เป็นเว็บที่ใช้ asset ภาพจริง

## โฟลเดอร์หลัก

assets/
- scenes/ : ภาพฉากหลังขนาดกว้าง เช่น cozy office / garden / cafe
- characters/mali/ : pose ของตัวละครมะลิ
- characters/ton/ : pose ของตัวละครต้น
- props/ : ของตกแต่ง เช่น หัวใจ ดอกไม้ กาแฟ โน้ต
- _source/ : ไฟล์ต้นฉบับจาก Figma / Photoshop / AI prompt

## ขนาดที่แนะนำ

scene background:
- 1920 x 1080 px
- file: .webp, .png หรือ .svg
- วางองค์ประกอบหลักไว้กลางภาพ และเว้นพื้นที่สำหรับ bubble overlay

character:
- 512 x 768 px หรือ 1024 x 1536 px
- PNG transparent หรือ SVG
- ควรมี pose อย่างน้อย: idle, happy, shy, walk

## วิธีเปลี่ยน asset

1. เอาไฟล์ภาพใหม่ไปใส่ใน assets/
2. เปิด config.js
3. แก้ path ในส่วน ASSETS
4. git add . / commit / push

## Prompt direction สำหรับสร้าง scene

cozy pastel 2D kawaii office interior, warm soft lighting, cute team workspace, bookshelves, coffee corner, desks, plants, heart sparkles, wide composition, clean center area for web UI overlay, polished illustration, soft pastel color palette

## Prompt direction สำหรับ character

cute chibi character, full body, transparent background, pastel outfit, soft shading, kawaii expression, front view, idle pose
