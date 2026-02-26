import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("masjid.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS finances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('income', 'expense')),
    category TEXT,
    amount REAL,
    description TEXT,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    quantity INTEGER,
    condition TEXT CHECK(condition IN ('good', 'fair', 'poor')),
    purchase_date TEXT,
    last_checked TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    speaker TEXT,
    date TEXT,
    time TEXT,
    location TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin', 'warga'))
  );

  -- Default Users
  INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
  INSERT OR IGNORE INTO users (username, password, role) VALUES ('warga', 'warga123', 'warga');

  -- Default Settings
  INSERT OR IGNORE INTO settings (key, value) VALUES ('mosque_name', 'Nurul Iman');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('mosque_address', 'Jl. Raya No. 123, Kota Bandung');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('mosque_phone', '0812-3456-7890');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('chairman_name', 'H. Ahmad Subarjo');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('treasurer_name', 'Hj. Siti Aminah');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('mosque_logo', '');

  -- Seed Data
  INSERT OR IGNORE INTO finances (type, category, amount, description, date) VALUES 
  ('income', 'Infaq', 5000000, 'Infaq Jumat Minggu 1', '2026-02-20'),
  ('income', 'Zakat', 2500000, 'Zakat Mal H. Ahmad', '2026-02-21'),
  ('expense', 'Listrik', 1200000, 'Tagihan Listrik Februari', '2026-02-22'),
  ('expense', 'Kebersihan', 500000, 'Gaji Marbot', '2026-02-23'),
  ('income', 'Shadaqah', 1000000, 'Shadaqah Hamba Allah', '2026-02-24');

  INSERT OR IGNORE INTO inventory (name, category, quantity, condition, purchase_date, last_checked) VALUES 
  ('Sound System Yamaha', 'Elektronik', 1, 'good', '2025-01-10', '2026-02-01'),
  ('Karpet Masjid', 'Perlengkapan', 20, 'good', '2024-12-05', '2026-02-15'),
  ('AC Split Daikin', 'Elektronik', 4, 'fair', '2024-06-20', '2026-01-20');

  INSERT OR IGNORE INTO events (title, speaker, date, time, location, description) VALUES 
  ('Kajian Fiqih Ibadah', 'Ustadz Adi Hidayat', '2026-03-01', '18:30', 'Ruang Utama', 'Pembahasan mendalam tentang tata cara shalat sesuai sunnah.'),
  ('Tabligh Akbar Ramadhan', 'Habib Luthfi', '2026-03-15', '20:00', 'Halaman Masjid', 'Menyambut bulan suci Ramadhan dengan hati yang bersih.');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stats", (req, res) => {
    const totalIncome = db.prepare("SELECT SUM(amount) as total FROM finances WHERE type = 'income'").get().total || 0;
    const totalExpense = db.prepare("SELECT SUM(amount) as total FROM finances WHERE type = 'expense'").get().total || 0;
    const inventoryCount = db.prepare("SELECT COUNT(*) as count FROM inventory").get().count;
    const upcomingEvents = db.prepare("SELECT COUNT(*) as count FROM events WHERE date >= date('now')").get().count;
    
    res.json({
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      inventoryCount,
      upcomingEvents
    });
  });

  // Finance Routes
  app.get("/api/finances", (req, res) => {
    const rows = db.prepare("SELECT * FROM finances ORDER BY date DESC LIMIT 50").all();
    res.json(rows);
  });

  app.post("/api/finances", (req, res) => {
    const { type, category, amount, description, date } = req.body;
    const info = db.prepare("INSERT INTO finances (type, category, amount, description, date) VALUES (?, ?, ?, ?, ?)").run(type, category, amount, description, date);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/finances/:id", (req, res) => {
    const { id } = req.params;
    const { type, category, amount, description, date } = req.body;
    db.prepare("UPDATE finances SET type = ?, category = ?, amount = ?, description = ?, date = ? WHERE id = ?")
      .run(type, category, amount, description, date, id);
    res.json({ status: "ok" });
  });

  app.delete("/api/finances/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM finances WHERE id = ?").run(id);
    res.json({ status: "ok" });
  });

  // Inventory Routes
  app.get("/api/inventory", (req, res) => {
    const rows = db.prepare("SELECT * FROM inventory").all();
    res.json(rows);
  });

  app.post("/api/inventory", (req, res) => {
    const { name, category, quantity, condition, purchase_date } = req.body;
    const info = db.prepare("INSERT INTO inventory (name, category, quantity, condition, purchase_date, last_checked) VALUES (?, ?, ?, ?, ?, date('now'))").run(name, category, quantity, condition, purchase_date);
    res.json({ id: info.lastInsertRowid });
  });

  // Events Routes
  app.get("/api/events", (req, res) => {
    const rows = db.prepare("SELECT * FROM events ORDER BY date ASC").all();
    res.json(rows);
  });

  app.post("/api/events", (req, res) => {
    const { title, speaker, date, time, location, description } = req.body;
    const info = db.prepare("INSERT INTO events (title, speaker, date, time, location, description) VALUES (?, ?, ?, ?, ?, ?)").run(title, speaker, date, time, location, description);
    res.json({ id: info.lastInsertRowid });
  });

  // Settings Routes
  app.get("/api/settings", (req, res) => {
    const rows = db.prepare("SELECT * FROM settings").all();
    const settings: Record<string, string> = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body;
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        upsert.run(key, value);
      }
    });
    transaction(settings);
    res.json({ status: "ok" });
  });

  // Auth Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT id, username, role FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Username atau password salah" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
