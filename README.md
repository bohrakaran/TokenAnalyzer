# 🚀 TokenAnalyzer: AI Token Usage & Cost Dashboard

**TokenAnalyzer** is a powerful full-stack application designed to help developers monitor, estimate, and visualize token consumption and costs for various AI models, including OpenAI and local Ollama instances.

---

## ✨ Key Features

- **Accurate Tokenization:** Uses `tiktoken` (same as OpenAI) for precise token counting.
- **Cost Estimation:** Real-time cost calculation for multiple models (GPT-4, GPT-3.5, etc.).
- **Ollama Integration:** Support for local models running via Ollama.
- **Modern UI/UX:** A sleek, responsive dashboard built with React and Tailwind CSS.
- **Fast Performance:** High-performance backend powered by FastAPI.

---

## 🛠️ Tech Stack

### Backend
- **Language:** Python 3.x
- **Framework:** FastAPI
- **Library:** `tiktoken` (for tokenization)
- **Server:** Uvicorn

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Heroicons / Lucide

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js (v18+)
- Git

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt  # Ensure you have your requirements listed
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```text
TokenAnalyzer/
├── backend/            # FastAPI Backend
│   └── main.py         # Main API logic
├── frontend/           # React Frontend
│   ├── src/            # Components & Logic
│   └── public/         # Static assets
└── .gitignore          # Git ignore rules
```

---

## 🤝 Contributing
Feel free to fork this project and submit PRs for any improvements or new features!

## 📄 License
This project is open-source.
