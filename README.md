# 🚗 AutoCert – Vehicle Inspection & Registration Center System

## Project Description

**AutoCert** is a next-generation web application designed to revolutionize the vehicle marketplace by combining **secure vehicle buying & selling** with **professional inspection and certification services**. The platform ensures a verified marketplace where customers can confidently list vehicles, book comprehensive inspections (mobile or center-based), and receive detailed digital inspection reports.

### Key Objectives:
- **Secure Marketplace**: Verified vehicle listings with comprehensive inspection services
- **Trust & Transparency**: Digital inspection reports and certified vehicle history
- **Convenience**: Mobile inspection services and center-based options
- **Real-time Communication**: Integrated chat system for buyer-seller interactions

### Target Users:
- **Vehicle Sellers**: List and sell vehicles with certified inspections
- **Vehicle Buyers**: Purchase with confidence using verified inspection reports
- **Inspection Centers**: Manage bookings and provide professional inspection services
- **Mobile Inspectors**: On-site inspection services at customer locations

## Screenshots

### Home Page & Vehicle Marketplace
<img width="1898" height="979" alt="Screenshot 2025-09-21 194841" src="https://github.com/user-attachments/assets/68447d15-23ce-44aa-aebb-3671db865435" />

*Modern landing page showcasing featured vehicles and inspection services*
<img width="1920" height="1080" alt="Screenshot 2025-09-21 195130" src="https://github.com/user-attachments/assets/8989b9e7-f077-42c9-96f5-d6da81da5310" />

*Browse verified vehicles with detailed information and inspection status*
*Customer portal for managing listings, bookings, and inspection reports*

### Add Listning Features
<img width="1920" height="1080" alt="Screenshot 2025-09-21 200045" src="https://github.com/user-attachments/assets/6c5e7d1c-d79c-4837-9b39-2c4e5ab80ba4" />

*WebSocket-powered real-time messaging between buyers and sellers*
<img width="1920" height="1080" alt="Screenshot 2025-09-21 200328" src="https://github.com/user-attachments/assets/01d3bf41-496f-4559-abd2-72294291e383" />


## Features Overview

### 🔹 Admin Features
- **User & Role Management**: Manage admins, inspectors, and customers
- **Vehicle Approvals**: Approve or reject pending vehicle listings
- **Inspector Assignment**: 
  - Auto-assign inspectors for center-based bookings
  - Manual assignment for mobile bookings (on-site visits)
- **Inspection Management**: Monitor bookings, assign inspectors, track status
- **Reports Dashboard**: View and manage inspection reports
- **Analytics**: Comprehensive dashboard with booking and user activity insights

### 🔹 Inspector Features
- **Assignment Management**: View assigned inspections (mobile or center-based)
- **Digital Inspection Forms**: Comprehensive vehicle assessment tools
- **Cloud Report Upload**: Secure PDF report generation via Cloudinary
- **Status Updates**: Real-time booking status management
- **Mobile-Friendly Interface**: Optimized for on-site mobile inspections

### 🔹 Customer Features
- **Secure Authentication**: JWT-based role-specific access control
- **Vehicle Marketplace**: List vehicles with professional image hosting via imgbb
- **Inspection Booking**: Choose between mobile or center services with flexible scheduling
- **Real-time Notifications**: Booking status, inspector assignment, and report availability
- **Report Access**: Download and view detailed inspection reports
- **Live Chat**: WebSocket-based communication with potential buyers/sellers

## Tech Stack

| Layer | Technology / Tool |
|-------|-------------------|
| **Backend** | Java, Spring Boot, Hibernate (JPA), MySQL |
| **Frontend** | HTML5, CSS3, Bootstrap 5, JavaScript (ES6+) |
| **Authentication** | Spring Security with JWT |
| **Cloud Storage** | imgbb (Vehicle Images), Cloudinary (PDF Reports) |
| **Email Service** | JavaMail API |
| **Real-time Chat** | WebSocket (STOMP) |
| **Build Tool** | Maven |
| **Database** | MySQL 8.0+ |

## Setup Instructions

### Prerequisites
- **Java 17+** installed
- **Maven 3.8+** installed  
- **MySQL 8.0+** installed and running
- **Node.js** (optional, for any frontend tooling)
- **Git** for version control

### Backend Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/autocert.git
   cd autocert
   ```


2. **Configure Application Properties**
   ```bash
   # Navigate to src/main/resources/
   cd src/main/resources/
   
   # Copy and edit application.properties
   cp application.properties.example application.properties
   ```
   
   **Edit `application.properties`:**
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/autocert_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   # JPA Configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
   
   # JWT Configuration
   jwt.secret=YourSecretKeyHere
   jwt.expiration=86400000
   
   # Email Configuration
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   
   # File Upload Configuration
   spring.servlet.multipart.max-file-size=10MB
   spring.servlet.multipart.max-request-size=10MB
   
   # Cloud Storage API Keys
   imgbb.api.key=your_imgbb_api_key
   cloudinary.cloud.name=your_cloudinary_cloud_name
   cloudinary.api.key=your_cloudinary_api_key
   cloudinary.api.secret=your_cloudinary_api_secret
   ```

4. **Install Dependencies and Run**
   ```bash
   # Install dependencies
   mvn clean install
   
   # Run the application
   mvn spring-boot:run
   ```

   The backend server will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd src/main/resources/static
   ```

2. **Configure API Endpoints**
   ```javascript
   // Edit js/config.js
   const API_BASE_URL = 'http://localhost:8080/api';
   const WEBSOCKET_URL = 'http://localhost:8080/ws';
   ```

3. **Serve Frontend** (Development)
   ```bash
   # Option 1: Use Python (if installed)
   python -m http.server 3000
   
   # Option 2: Use Node.js http-server
   npx http-server -p 3000
   
   # Option 3: Use Live Server (VS Code Extension)
   # Right-click on index.html and select "Open with Live Server"
   ```

   Access the application at `http://localhost:3000`

## Demo Video

🎥 **Watch the complete AutoCert system demonstration:**

📺 **[AutoCert - Vehicle Inspection & Registration Center System Demo](https://youtu.be/GTX5bveMUio)**

*The demo video showcases:*
- Complete user registration and authentication flow
- Admin dashboard and vehicle approval process
- Inspector assignment and mobile inspection workflow
- Customer vehicle listing and booking process
- Real-time chat functionality between users
- Comprehensive inspection report generation
- Cloud storage integration for images and documents


## Contact

**Project Developer:** [Your Name]
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [@yourusername](https://github.com/yourusername)

---

⭐ **If you found this project helpful, please give it a star!** ⭐
