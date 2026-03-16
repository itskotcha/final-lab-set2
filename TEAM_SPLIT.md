# TEAM_SPLIT.md

## Team Members

* นางสาวดาวประกาย เสาร์สิงห์
* นางสาวกชพร วงศ์ใหญ่

---

## Work Allocation

### Student 1: นางสาวดาวประกาย เสาร์สิงห์

**Deployment**
- สร้างโปรเจกต์บน Railway
- ตั้งค่า Environment Variables สำหรับแต่ละ Service
- Deploy Service ทั้งหมดให้ใช้งานได้จริง

**Testing & Integration**
- ทดสอบระบบแบบ end-to-end
- ตรวจสอบว่า Task Service, Auth Service และ Frontend ทำงานร่วมกันได้

**Documentation**
- ทำ README / Screenshots / Architecture Diagram

### Student 2: นางสาวกชพร วงศ์ใหญ่

**Backend (Auth + Task Service)**
- ตั้งค่า Database ของแต่ละ Service
- เขียน API สำหรับแต่ละ Service
- จัดการ Security (JWT, Password hashing, Env vars)

**Frontend**
- ทำหน้า Login / Register / Task Board / Profile
- เชื่อมต่อ API ของ Auth และ Task Service
- ทำ Task filtering, Task editing, Task deletion

---

## Shared Responsibilities

* ร่วมกันออกแบบ **Microservices Architecture**
* ร่วมกันออกแบบ **Database structure**
* ทดสอบ **End-to-End flow ของระบบ**
* ตรวจสอบ **Security เช่น JWT validation และ Rate Limiting**
* จัดทำ **README, Screenshots และเอกสารประกอบโปรเจกต์**

---

## Reason for Work Split

การแบ่งงานใช้แนวคิด **Service-based responsibility** โดยแบ่งตามหน้าที่ของแต่ละ microservice เพื่อให้แต่ละคนสามารถพัฒนาและทดสอบ service ของตนเองได้อย่างอิสระ จากนั้นจึงนำมารวมกันผ่าน **API Gateway (Nginx)** และ Docker Compose ทำให้การพัฒนาระบบมีความเป็นระบบและลดความซ้ำซ้อนของงาน

---

## Integration Notes

ระบบถูกออกแบบในรูปแบบ **Microservices Architecture** โดยแต่ละ service ทำงานแยกกันแต่เชื่อมต่อผ่าน API

* **Auth Service** ทำหน้าที่ตรวจสอบผู้ใช้และสร้าง JWT Token
* **Task Service** ใช้ JWT Token เพื่อตรวจสอบสิทธิ์ก่อนจัดการข้อมูล Task
* **Log Service** บันทึกเหตุการณ์สำคัญ เช่น login, task creation, task deletion
* **Nginx** ทำหน้าที่เป็น **API Gateway** รับ request จาก client แล้วส่งต่อไปยัง service ที่เกี่ยวข้อง
* **Frontend** ติดต่อกับ backend ผ่าน API Gateway

การทำงานร่วมกันของทั้งสองสมาชิกช่วยให้ระบบสามารถทำงานครบทั้ง **Authentication, Task Management, Logging และ Security Control**