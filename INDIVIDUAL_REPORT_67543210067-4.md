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

