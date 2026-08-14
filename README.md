# 🌐 BlogSpace — Full-Stack Modern Blog & CMS Platform

A responsive Full-Stack Blog and Content Management Web Application built using the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js).

---

## 🚀 Key Features

* **JWT Stateless Authentication**: Secure user registration and login with encrypted password storage (`bcryptjs`) and role-based route protection.
* **Full Article CRUD Operations**: Compose, read, update, and delete rich blog posts with custom categories and tags.
* **Live Search & Topic Filter**: Debounced instant search query filtering with topic category pills and responsive pagination.
* **Interactive Discussion & Comments**: Leave and delete comments on published articles with real-time feedback.
* **Author Control Studio**: Dedicated creator dashboard to view, manage, and edit published articles.
* **Responsive UI Design**: Built with clean Vanilla CSS variables supporting fluid mobile, tablet, and desktop views.

---

## 🛠️ Technology Stack & Curriculum Mapping

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, HTML5, CSS3, Lucide Icons |
| **Backend** | Node.js, Express.js, RESTful Architecture |
| **Database** | MongoDB, Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), BcryptJS Password Hashing |
| **DevOps & Tools** | Git, Vite, Postman |

---

## 💻 How to Run Locally

### Prerequisites:
* [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### 1. Clone the Repository
```bash
git clone https://github.com/Retvij/blogverse.git
cd blogverse
```

### 2. Install Dependencies
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 3. Build & Launch the Application
```bash
# Build frontend bundle
cd ../frontend
npm run build

# Start the unified production server
cd ../backend
npm start
```

### 4. Open in Browser
Open **`http://localhost:5000`** in your browser.

---

## 🔑 Pre-Loaded Demo Accounts

| Account Role | Email | Password |
| :--- | :--- | :--- |
| **Author (John Doe)** | `john@example.com` | `password123` |
| **Author (Jane Smith)** | `jane@example.com` | `password123` |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
