# Moment Garden

เว็บน่ารัก ๆ สำหรับแชร์โมเมนต์ระหว่างเพื่อนในทีมกลุ่มเล็ก ๆ โดยใช้ตัวละครนามสมมุติ เช่น มะลิ และ ต้น

## สิ่งที่ทำได้ในเวอร์ชันนี้

- หน้าเว็บ interactive ธีม pastel / kawaii / cozy office
- ตัวละคร 2 ตัวเดินไปมาในฉาก
- แชร์โมเมนต์ใหม่เป็น bubble ลอยในฉาก
- กด bubble เพื่ออ่านเรื่องเต็ม
- กด reaction ได้ เช่น น่ารัก, น่าสงสัย, เขินแทน, ship
- Heart Meter เพิ่มตามจำนวนโมเมนต์และ reaction
- Timeline ความสัมพันธ์
- Mood วันนี้ของตัวละคร
- Invite code ก่อนเข้าเว็บ
- Admin panel สำหรับลบ/approve โมเมนต์
- ทำงานได้ทันทีด้วย localStorage
- รองรับการต่อ Supabase เพื่อให้เพื่อนหลายคนแชร์ข้อมูลร่วมกันจริง ๆ

## วิธีเปิดดูบนเครื่อง

เปิดไฟล์ `index.html` ด้วย browser ได้เลย

Invite code เริ่มต้นคือ:

`MALI-TON`

Admin code เริ่มต้นคือ:

`GARDEN-ADMIN`

เปลี่ยนได้ที่ไฟล์ `config.js`

## วิธีอัพขึ้น GitHub Pages แบบง่าย

1. สร้าง repository ใหม่ใน GitHub
2. อัพไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น repo
3. ไปที่ Settings > Pages
4. เลือก Deploy from a branch
5. เลือก branch `main` และ folder `/root`
6. กด Save
7. รอ GitHub Pages สร้างเว็บ แล้วเปิดลิงก์ที่ GitHub ให้มา

## วิธีตั้งค่าให้เพื่อนแชร์ข้อมูลร่วมกันจริง ๆ

ถ้าไม่ต่อ database เว็บจะเก็บข้อมูลแค่ใน browser ของแต่ละคน ดังนั้นแต่ละคนจะเห็นข้อมูลของตัวเองเท่านั้น

ถ้าต้องการให้ทุกคนเห็นโมเมนต์ร่วมกัน ให้ใช้ Supabase:

1. สร้าง project ที่ Supabase
2. เปิด SQL Editor
3. Copy เนื้อหาใน `supabase_schema.sql` ไปรัน
4. ไปที่ Project Settings > API
5. Copy Project URL และ anon public key
6. เปิดไฟล์ `config.js`
7. ใส่ค่าในช่องนี้:

```js
SUPABASE_URL: "https://your-project.supabase.co",
SUPABASE_ANON_KEY: "your-anon-key"
```

8. อัพไฟล์ขึ้น GitHub อีกครั้ง

## หมายเหตุเรื่องความเป็นส่วนตัว

เว็บนี้ตั้งใจให้เป็นพื้นที่เล่นสนุกแบบน่ารัก ๆ ภายในกลุ่มเล็ก ๆ เท่านั้น ควรใช้นามสมมุติ ไม่ใช้ชื่อจริง และควรมี admin คอยลบข้อความที่ทำให้คนจริงไม่สบายใจ

ถ้าเรื่องราวอ้างอิงคนจริงในทีม ควรตั้งกติกาก่อนเล่น เช่น:

- ไม่ใช้ชื่อจริง
- ไม่โพสต์เรื่องที่ทำให้เสียหาย
- ไม่กดดันให้ใครต้องเปิดเผยความรู้สึก
- ใครไม่โอเคให้ลบโพสต์ได้ทันที

## ปรับแต่งตัวละคร

แก้ที่ `config.js`:

```js
CHARACTERS: {
  girl: { name: "มะลิ", mood: "ใจฟู", note: "..." },
  boy: { name: "ต้น", mood: "เขินนิดๆ", note: "..." }
}
```

## โครงสร้างไฟล์

```text
moment-garden/
├─ index.html
├─ styles.css
├─ app.js
├─ config.js
├─ supabase_schema.sql
└─ README.md
```


## v0.1.1 update

- Removed the invite-code gate. The website opens immediately for small private-team usage.
- Fixed the browser random ID bug in `app.js`.
- Changed the old invite-code input type from password to text, in case the login screen is re-enabled later.


## v0.2 Asset-ready structure

เพิ่มโครงสร้างสำหรับใช้ภาพ asset จริงแล้ว:

- `assets/scenes/` สำหรับภาพฉากหลังหลัก
- `assets/characters/mali/` สำหรับ pose ของมะลิ
- `assets/characters/ton/` สำหรับ pose ของต้น
- `assets/props/` สำหรับของตกแต่ง
- `ASSET_GUIDE.md` สำหรับรายละเอียดขนาดไฟล์ / prompt / วิธีเปลี่ยนภาพ

เว็บจะอ่าน asset จาก `config.js` ในส่วน `ASSET_MODE`, `ASSETS`, และ `SCENE`.
ถ้าต้องการเปลี่ยนภาพฉาก ให้แทนที่ path นี้:

`ASSETS.scene.background`

ถ้าต้องการเปลี่ยนตัวละคร ให้แทนที่ path ใน:

`ASSETS.characters.girl`
`ASSETS.characters.boy`
