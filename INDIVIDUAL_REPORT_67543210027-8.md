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
