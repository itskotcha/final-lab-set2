# INDIVIDUAL_REPORT_67543210067-4.md

## ข้อมูลผู้จัดทำ
- ชื่อ-นามสกุล: นางสาว กชพร วงศ์ใหญ่
- รหัสนักศึกษา: 67543210067-4
- กลุ่ม: 09

## ขอบเขตงานที่รับผิดชอบ
- พัฒนา Backend ของ Auth Service และ Task Service
- การตั้งค่า Database ของแต่ละ Service
- เขียน API และจัดการ Security เช่น JWT, Password Hashing
- พัฒนา Frontend หน้า Login, Register, Task Board และ Profile
- Integration ระหว่าง Backend Services และ Frontend

## สิ่งที่ได้ดำเนินการด้วยตนเอง
- สร้างและตั้งค่า Database ของ Auth Service และ Task Service แยกกัน
- เขียน API สำหรับการ login, register, CRUD Task และ JWT verification
- พัฒนา Frontend ให้สามารถเชื่อมต่อ API ทั้ง Auth และ Task Service
- Implement Task filtering, Task editing และ Task deletion
- Integration ระหว่าง Frontend, Auth Service และ Task Service ให้ทำงานร่วมกันได้
- Testing และ debugging ของทั้ง backend และ frontend พร้อมตรวจสอบ JWT flow และ error handling

## ปัญหาที่พบและวิธีการแก้ไข
- **ปัญหา:** Task Service 500 error เนื่องจาก DB connection ไม่พร้อม  
  **วิธีแก้ไข:** ตรวจสอบ Database URL และ environment variables ของ Task Service ให้ถูกต้อง
- **ปัญหา:** Frontend ไม่แสดงข้อมูล Task  
  **วิธีแก้ไข:** ปรับ API URL และเรียก JWT token จาก localStorage ให้ถูกต้อง

## สิ่งที่ได้เรียนรู้จากงานนี้
- การแยก Service ทำให้การพัฒนา Backend เป็นอิสระและง่ายต่อการทดสอบ
- การจัดการ JWT และสิทธิ์ผู้ใช้งานเป็นสิ่งสำคัญต่อ security ของระบบ
- การ integrate frontend กับ backend ต้องเข้าใจทั้ง API endpoints และ authorization
- การ debug ระบบ microservices ต้องตรวจสอบทั้ง Service, Database และ Frontend ร่วมกัน

# INDIVIDUAL_REPORT_67543210027-8.md

## ข้อมูลผู้จัดทำ
- ชื่อ-นามสกุล: นางสาว ดาวประกาย เสาร์สิงห์
- รหัสนักศึกษา: 67543210027-8
- กลุ่ม: 09

## ขอบเขตงานที่รับผิดชอบ
- Deployment ของทั้งระบบบน Railway Cloud
- การตั้งค่า Environment Variables ของ Auth, Task และ User Services
- การทำ Testing & Integration แบบ end-to-end
- จัดทำ Documentation เช่น README, Architecture Diagram และ Screenshots

## สิ่งที่ได้ดำเนินการด้วยตนเอง
- สร้างโปรเจกต์บน Railway และตั้งค่า Environment Variables สำหรับแต่ละ Service
- Deploy Auth Service, Task Service และ Frontend Service ให้ทำงานได้จริง
- ทดสอบระบบแบบ end-to-end ตรวจสอบการทำงานของแต่ละ service และความถูกต้องของ JWT flow
- จัดทำเอกสาร README, Architecture Diagram และ Screenshots ของระบบ
- ประสานงานกับสมาชิกคนอื่น ๆ ในการ merge service เข้าด้วยกันและแก้ปัญหา integration

## ปัญหาที่พบและวิธีการแก้ไข
- **ปัญหา:** หน้าเว็บ frontend ไม่โหลดเพราะ API ยังไม่ได้รัน  
  **วิธีแก้ไข:** รัน Auth Service และ Task Service พร้อมกับ frontend พร้อมตรวจสอบ API endpoints  
- **ปัญหา:** Deployment บน Railway ไม่ผ่านเนื่องจาก Environment Variables ไม่ถูกต้อง  
  **วิธีแก้ไข:** ตรวจสอบและกำหนดค่า environment variables ให้ตรงกับ Database URL, JWT_SECRET และ PORT ของแต่ละ service

## สิ่งที่ได้เรียนรู้จากงานนี้
- การแยก service ตาม **Microservices Architecture** ช่วยให้การพัฒนาและ testing แต่ละ service เป็นอิสระและชัดเจน
- การจัดการ **JWT flow** และ security ของแต่ละ service เป็นสิ่งสำคัญ
- การ deploy ระบบบน Cloud จำเป็นต้องเข้าใจ Environment Variables และการเชื่อมโยง service ผ่าน API
- การทำงานร่วมกันเป็นทีมช่วยให้การ integrate service ทำได้ราบรื่นและลดข้อผิดพลาด
