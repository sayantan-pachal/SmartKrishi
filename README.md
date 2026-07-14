<div align="center">
  
# 🌾 SmartKrishi

**Next-Generation Farm & Crop Management Platform**

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white" alt="Google Sheets Backend" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

</div>

---

## 📖 About The Project

**SmartKrishi** is a modern agricultural management web application designed to empower farmers with data-driven insights. By combining real-time environmental data with intelligent analysis, the platform helps farmers optimize field management, monitor crop health, and increase overall yield. 

Instead of a traditional backend, SmartKrishi utilizes a unique and lightweight architecture where **Google Sheets** serves as the database, accessed via a custom **Google Apps Script** API.

## ✨ Key Features

- 🗺️ **Multi-Field Management:** Effortlessly track and manage multiple agricultural plots in one place.
- 🌦️ **Weather-Based Advisories:** Receive actionable insights tailored to your farm's local weather patterns.
- 🐛 **Crop Disease Detection:** Analyze crop images to identify potential diseases or pest infestations early.
- 📊 **Intuitive Dashboard:** A clean, modern (glassmorphic), and responsive interface built for easy access on any device.
- 🔐 **Secure Authentication:** Personalized user accounts to ensure farm data privacy and security.

---

## 🛠️ Built With

* **Frontend:** React, JavaScript (ES6+), HTML5
* **Build Tool:** Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Routing:** React Router v6
* **Backend/Database:** Google Apps Script & Google Sheets API
* **Deployment:** Vercel

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
* npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/sayantan-pachal/smartkrishi.git](https://github.com/sayantan-pachal/smartkrishi.git)
   cd smartkrishi

2. Install NPM packages:
``npm install``

3. Configure Environment Variables:
- Create a .env file in the root directory and add your Google Apps Script URL:
``VITE_GOOGLE_SCRIPT_URL=your_google_script_web_app_url_here``

4. Run the development server:

``npm run dev``
5. Open your browser and navigate to http://localhost:5173