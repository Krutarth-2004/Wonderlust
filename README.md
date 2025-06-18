# 🏡 Wonderlust - Airbnb Clone

**Wonderlust** is a full-stack Airbnb clone web application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Users can register, create property listings, mark favorites, make bookings, and write reviews — all wrapped in a clean and responsive interface.

> 🚀 Live Website: [https://wonderlust-fsbk.onrender.com](https://wonderlust-fsbk.onrender.com)

---

## 🌟 Features

- 🔐 User authentication (register, login, logout)
- 🏠 Create, edit, delete property listings
- 🖼️ Upload images using Cloudinary
- 📌 Add and remove listings from favorites
- 📅 Booking system with date validation
- 📝 Leave and manage reviews with ratings
- 🗺️ Location display with Leaflet.js
- 💬 Flash messages for user actions
- 📱 Responsive design with EJS + Bootstrap
- 🛠️ RESTful routing & MVC structure

---

## 🧱 Project Structure

- 📦 wonderlust/
- app.js  (Main application entry point)
- config/  (Database & Cloudinary configuration files)
- controllers/  (Route handler logic (CRUD operations, etc.))
- init/  (Optional initial data seeding)
- middleware.js  (Custom middleware (auth, flash, etc.))
- models/  (Mongoose models (User, Listing, Review))
- public/  (Static assets (CSS, client-side JS, images))
- routes/  (Express route definitions)
- utils/  (Helper functions and validators)
- views/  (EJS template files (layouts, partials, pages))
- schema.js  (Joi schema validations)
- package.json  (NPM dependencies and scripts)
- README.md  (Project documentation)

---

## 💻 Tech Stack

| Category    | Technologies Used                                 |
|-------------|---------------------------------------------------|
| Frontend    | HTML, EJS, CSS, Bootstrap                         |
| Backend     | Node.js, Express.js                               |
| Database    | MongoDB, Mongoose                                 |
| Other Tools | Cloudinary, Leaflet.js, Toastify, Multer, Joi     |
| Auth        | Passport.js, Bcrypt.js                            |
| Deployment  | Render, MongoDB Atlas                             |

---

## ⚙️ Installation

### 📥 Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/wonderlust.git
cd wonderlust
npm install

🧪 Environment Variables
Create a .env file in the root directory and add the following:

MONGO_URI=<your_mongodb_connection_string>
CLOUD_NAME=<your_cloudinary_name>
CLOUD_API_KEY=<your_api_key>
CLOUD_API_SECRET=<your_api_secret>
SECRET=<your_session_secret>
MAP_TOKEN=<your_map_token>
GMAIL_USER=<your_gmail_user>
GMAIL_PASS=<your_gmail_pass>

🚀 Run the App
npm run dev

Then open your browser and navigate to:
📍 http://localhost:8080

🔧 Available Scripts
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
🌐 Deployment
This app is deployed on Render.

To deploy:

Push the code to GitHub

Create a Render Web Service from the repo

Add environment variables in Render dashboard

Connect to MongoDB Atlas and Cloudinary

🔐 Authentication & Authorization
Only registered users can:

Create/edit/delete their listings

Post and delete their reviews

Add/remove favorites

Non-logged-in users are redirected to /login

🚧 TODO / Future Enhancements
Add Google OAuth login

Improve mobile responsiveness

Add email notifications for bookings

Add pagination and filtering

📄 License
This project is licensed under the MIT License.

🙋‍♂️ Author
Your Name
📧 krutarthkadia@gmail.com
🐙 GitHub: @Krutarth-2004
🔗 LinkedIn: https://www.linkedin.com/in/krutarth-kadia-76652931a/

⭐️ If you like this project...
Please consider giving it a ⭐ on GitHub! It helps others discover it 🙌
