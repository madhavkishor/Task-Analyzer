# 🎯 Smart Task Analyzer

**AI-Powered Task Prioritization System** - A Django-based web application that intelligently scores and prioritizes tasks using multiple factors including urgency, importance, effort, and dependencies.

## 🚀 Features

### 🤖 Smart Priority Algorithm
- **Multi-factor scoring** considering urgency, importance, effort, and dependencies
- **4 Analysis Strategies**: Smart Balance, Fastest Wins, High Impact, Deadline Driven
- **Configurable weights** for different prioritization approaches
- **Circular dependency detection** to prevent logical errors

### 💻 Modern Tech Stack
- **Backend**: Django REST API with Python
- **Frontend**: Vanilla JavaScript with modern CSS3
- **Database**: SQLite (production-ready PostgreSQL compatible)
- **UI/UX**: Glass morphism design with responsive layout

### 🎨 User Experience
- **Real-time task analysis** with visual priority indicators
- **Bulk JSON import** for quick task management
- **Interactive strategy selection** with visual cards
- **Smart suggestions** for top 3 tasks to focus on
- **Live statistics** and progress tracking

## 📋 Assignment Requirements Fulfilled

✅ **Backend Development** (Django/Python)
- Task model with all required fields
- Priority scoring algorithm with multiple factors
- API endpoints: `/api/tasks/analyze/` and `/api/tasks/suggest/`
- Comprehensive error handling and validation

✅ **Frontend Development** (HTML/CSS/JavaScript)
- Modern, responsive user interface
- Multiple sorting strategy toggle
- Form validation and error handling
- Real-time API integration

✅ **Bonus Features**
- Circular dependency detection
- Professional UI/UX design
- Comprehensive unit tests
- Detailed documentation

## 🛠️ Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/task-analyzer.git
cd task-analyzer

# Install dependencies
pip install -r requirements.txt

# Setup backend
cd backend
python manage.py migrate
python manage.py runserver

# Open frontend (in new terminal)
cd ../frontend
python -m http.server 3000
Visit http://localhost:3000 to use the application!

📁 Project Structure
text
task-analyzer/
├── backend/                 # Django backend
│   ├── tasks/              # Main application
│   │   ├── scoring.py      # Core priority algorithm
│   │   ├── views.py        # API endpoints
│   │   └── tests.py        # Unit tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # Static frontend
│   ├── index.html         # Main interface
│   ├── styles.css         # Modern CSS design
│   └── script.js          # Frontend logic
└── README.md              # Comprehensive documentation
🎯 Algorithm Details
The priority scoring uses a weighted approach:

Urgency (40%): Due date proximity with past-due penalties

Importance (30%): User-provided 1-10 scale

Effort (20%): Lower effort tasks for quick wins

Dependencies (10%): Tasks blocking others get priority

👨‍💻 Developer
Madhav Kishor
