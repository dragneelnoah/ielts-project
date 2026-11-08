# IELTS Academic Task 1 Interactive Studio

A modern, responsive, single-page interactive web application built for English language instructors and IELTS candidates to practice Task 1 graph analysis.

## 🚀 Features
- **40 Built-in IELTS Exercises:** 10 authentic practice datasets for Line Graphs, Bar Charts, Pie Charts, and Data Tables.
- **Dynamic JSON Exercise Engine:** Fetches exercises dynamically from `js/sample-questions/[category]/`.
- **Click & Tweak Editor:** Interactive form controls to adjust values and labels in real-time.
- **JSON Configuration Mode:** Edit raw JSON data directly for advanced setups.
- **Responsive & Modern UI:** Built with Tailwind CSS, Chart.js, and clean separation of concerns.

## 📂 Project Structure
```text
ielts-graph-practice/
├── index.html              # Main application entry point
├── css/
│   └── style.css           # Custom styling and scrollbar polish
├── js/
│   ├── app.js              # Application state, Chart.js wrapper & exercise loader
│   └── sample-questions/   # 40 modular JSON exercise datasets
│       ├── line/           # 10 Line graph exercises (line-*.json)
│       ├── bar/            # 10 Bar chart exercises (bar-*.json)
│       ├── pie/            # 10 Pie chart exercises (pie-*.json)
│       └── table/          # 10 Data table exercises (table-*.json)
├── docs/
│   └── teacher-guide.md    # Guide for IELTS instructors
└── README.md               # Project documentation
```

## 🛠️ Local Development & Deployment
1. Clone or download this repository.
2. Serve the directory using a local web server (e.g., Live Server extension in VS Code, `python -m http.server`, or `npx serve`).
3. **Deploy to GitHub Pages:** Push this repository to GitHub, go to repository settings, enable GitHub Pages from the `main` branch, and share the live URL with your students!
