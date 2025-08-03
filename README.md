# XO Game Web App 🎮  
XO Game คือเว็บแอปพลิเคชันเกม XO (Tic-Tac-Toe) ที่สามารถ **เลือกขนาดกระดานได้** พร้อมฟีเจอร์ **บันทึกประวัติการเล่น, ดูย้อนหลัง (Replay)** และเชื่อมต่อฐานข้อมูล MongoDB

##วิธีการ setup
  1. ติดตั้งสิ่งที่จำเป็น
  ก่อนเริ่มต้องมี:
    Node.js (ดาวน์โหลด: https://nodejs.org)
    MongoDB Community Server (ดาวน์โหลด: https://www.mongodb.com/try/download/community)
    Git (ดาวน์โหลด: https://git-scm.com/)
    ตรวจสอบว่า Node.js และ npm ติดตั้งแล้ว:node -v , npm -v เช็คใน cmd

  2. Clone โปรเจกต์จาก GitHub
    git clone https://github.com/<username>/XO_Game.git
    cd XO_Game

  3. ติดตั้ง Dependencies 
   *Frontend (React)
    เข้าไปที่โฟลเดอร์ frontend : cd frontend
    ติดตั้ง dependencies หลักที่ระบุใน package.json : npm install

  *Backend (Node.js + Express + MongoDB)
    กลับไปที่ root แล้วเข้าโฟลเดอร์ backend : cd ../backend
    ติดตั้ง dependencies : npm install

  4. ตั้งค่า MongoDB
    ติดตั้ง MongoDB ให้เสร็จสมบูรณ์
    รัน MongoDB Service : net start MongoDB (ถ้าใช้ mongod แทน ให้เปิด Command Prompt ใหม่แล้วพิมพ์ mongod)

###วิธีการRun
  ## 1 รัน Backend (API Server)
  1. เปิด Terminal แล้วเข้าไปที่โฟลเดอร์ backend:
    *
     cd backend
     node server.js
     ถ้าเซิร์ฟเวอร์รันสำเร็จ จะเห็นข้อความ:
     🚀 Server running on http://localhost:5000
     ✅ MongoDB connected
  ## 2 รัน Frontend (React)
  1.เปิด Terminal ใหม่ (อย่าปิด Backend)
  เข้าไปที่โฟลเดอร์ frontend:
  *
    cd frontend
    npm start
    ถ้าไม่มีปัญหา React จะรันที่ http://localhost:3000
  **เท่านี้ก็สามารถเล่นเกมได้แล้ว**
 
### 🧠 วิธีออกแบบโปรแกรม 
  ## 1 โครงสร้างระบบ (System Architecture)
   *Frontend (React.js):  
     ใช้สำหรับ UI (User Interface) และการโต้ตอบกับผู้ใช้  
     แสดงกระดาน XO, รับอินพุตจากผู้เล่น, แสดงผลผู้ชนะ และดู Replay  
    *Backend (Node.js + Express):  
     API Server เชื่อมต่อกับ MongoDB  
     จัดการการบันทึกเกม, ดึงประวัติการเล่น, ล้างข้อมูล และให้ข้อมูล Replay  
    *Database (MongoDB):  
     เก็บประวัติการเล่น (board size, moves, winner, เวลาเล่น)  
     ## 2 การออกแบบโฟลเดอร์ (Folder Structure)
##xo-webapp/
├── backend/
│ ├── models/ # เก็บ Schema ของ MongoDB (Game.js)
│ ├── routes/ # จัดการ API Routes (gameRoutes.js)
│ └── server.js # Main server file (Express + MongoDB connection)
│
├── frontend/
│ ├── public/ # HTML template, favicon
│ ├── src/
│ │ ├── App.js # UI หลัก + Logic เชื่อม Backend
│ │ ├── GameBoard.js # Logic ของเกม XO และตรวจผู้ชนะ
│ │ ├── Replay.js # ฟีเจอร์ดู Replay
│ │ └── index.js # Entry point ของ React
│
└── README.md
## 3 Flow การทำงานของระบบ
   1. ผู้เล่นเปิดเว็บ XO Game (React) → เลือกขนาดกระดาน (3x3 - 15x15)  
  2. เมื่อเล่นครบแล้ว ระบบตรวจหาผู้ชนะ (Algorithm)  
  3. Frontend ส่งข้อมูล **(board size, moves, winner)** ไปยัง Backend ผ่าน API  
  4. Backend บันทึกข้อมูลลง MongoDB  
  5. ผู้ใช้สามารถดู **History** และเลือก Replay เกมย้อนหลังได้  
  6. Replay แสดงการเดินทีละตาตามข้อมูลที่บันทึกไว้
  ##ตรวจหาผู้ชนะ (Winner Checking Algorithm)
- ตรวจสอบทุกแถว (Rows) → ถ้าค่าเหมือนกันทั้งแถว → ชนะ  
- ตรวจสอบทุกคอลัมน์ (Columns) → ถ้าค่าเหมือนกันทั้งคอลัมน์ → ชนะ  
- ตรวจสอบเส้นทแยงมุม (Diagonals) → ถ้าค่าเหมือนกันทั้งเส้น → ชนะ  
- ถ้ากระดานเต็มแล้วไม่มีผู้ชนะ → เสมอ (Draw)
  ## 🎯 การบันทึก Moves และ Replay
 การเดิน (Moves) จะถูกบันทึกเป็นลิสต์ เช่น: ["X:0,1","O:1,2","X:2,2"]
 ฟีเจอร์ **Replay** ใช้ `setInterval` ใน React เพื่อแสดงการเดินทีละขั้น  
- UI จะอัปเดตกระดานตามข้อมูล moves ที่บันทึกไว้
  ## ✅ การจัดการประวัติการเล่น (History)
  Backend มี API ดังนี้:
  *GET** `/api/game/history` → ดึงประวัติการเล่นทั้งหมด  
  *POST** `/api/game/save` → บันทึกเกมใหม่  
  *GET** `/api/game/replay/:id` → ดึงข้อมูลเกมตาม ID เพื่อ Replay  
  *DELETE** `/api/game/history` → ลบประวัติการเล่นทั้งหมด


