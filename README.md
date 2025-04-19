# 🛍️ Shopping Website

A full-stack shopping website built with:

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL

---

## 📁 Project Structure

```bash
Website/
├── backend/               # Express.js backend
│   ├── db.js              # Database connection
│   └── server.js          # API server
├── frontend/              # React frontend
│   ├── public/
│   └── src/
├── shopping.db            # PostgreSQL schema and data
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mindofVishesh/Website.git
cd Website
```

### 2. Set Up the Database

Ensure PostgreSQL is installed and running.

- **Using pgAdmin**:
  1. Create a new database (e.g., `shopping`).
  2. Open `shopping.db` and execute the SQL script to initialize the schema.

- **Using psql CLI**:

```bash
createdb shopping
psql -d shopping -f shopping.db
```

### 3. Configure the Backend

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install express knex pg cors
```

Create `db.js` with the following content:

```javascript
// backend/db.js
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'shopping'
  }
});

module.exports = db;
```

Then start the backend server:

```bash
node server.js
```

### 4. Set Up the Frontend

Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

Start the React development server:

```bash
npm start
```

Visit `http://localhost:3000` to view the website.

---

## 🤝 Contributing

1. **Fork the repo**: Click "Fork" on GitHub.
2. **Clone your fork**:

```bash
git clone https://github.com/your-username/Website.git
cd Website
```

3. **Create a branch**:

```bash
git checkout -b feature/your-feature-name
```

4. **Make changes** and commit:

```bash
git add .
git commit -m "Describe your changes"
```

5. **Push to your fork**:

```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request** from your fork to the original repo.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to open issues or PRs to contribute or suggest improvements!
