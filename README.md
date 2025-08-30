# 🛒 Retailon - Full Stack Retail Billing Solution  

**Retailon** is a **full-stack retail billing solution** specially designed for **retail businesses** to simplify and integrate billing operations with modern technology.  
It provides a **seamless billing experience**, **secure authentication**, and a powerful **Admin-User workflow** to manage retail stores efficiently.  

---

## 🚀 Features  

### 👨‍💼 Admin (Shop Owner)  
- 📊 **Sales Dashboard** with revenue insights  
- 👥 **Manage Users (Employees)** and assign roles  
- 🏷️ **Manage Categories & Items** (add, update, delete products)  
- 📑 **Order History & Tracking**  
- 🧾 **Bill Generation** with automated calculations  
- 📂 **Product Image Management** stored securely in **AWS S3 Bucket**  

### 👨‍🔧 User (Employee)  
- 🧾 **Create Bills** for customers  
- 📋 **View Orders** placed in the system  
- ⚡ **Quick and simple billing interface**  

---

## 💳 Payment Integration  
- **Cash Mode** 💵  
- **UPI Payments** via **Razorpay Integration**  

---

## 🔒 Authentication & Security  
- **JWT Authentication**  
- **Spring Security** for role-based access (Admin / User)  
- **Secure session management**  

---

## 🛠️ Tech Stack  

### Frontend  
- **React.js**  
- **Bootstrap CSS** for responsive UI  

### Backend  
- **Spring Boot**  
- **Spring Security + JWT Authentication**  
- **SQL Database** for persistent storage  

### Cloud & Payment Services  
- **AWS S3 Bucket** for product image storage  
- **Razorpay API** for UPI payment integration  


## ⚙️ Installation & Setup  

### Backend (Spring Boot)  
```bash
# Navigate to backend
cd backend

# Update database credentials in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/retailon
spring.datasource.username=root
spring.datasource.password=yourpassword

# Run the backend
mvn spring-boot:run


# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the frontend
npm start


## 🔮 Future Enhancements  

- 📱 Mobile app version for shop owners and employees  
- 📦 Inventory management with stock alerts  
- 📢 Notifications for low stock and daily sales reports  
- 📊 Advanced analytics & reporting  
- 🌍 Multi-store support with centralized dashboard  

---

## 👤 Author  

**Rashmi Ranjan Behera**  
📍 Odisha, India  
💻 Full-Stack Developer

🔗 [GitHub Profile](https://github.com/Rashmi-2005-Ranjan)
