import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasksByDate, setTasksByDate] = useState({});
  const [showInput, setShowInput] = useState(false);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  // NEW: month + year state
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // FIXED date format (local)
  const formatDate = (date) => {
    return date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");
  };

  const currentKey = formatDate(selectedDate);
  const tasks = tasksByDate[currentKey] || [];

  const addTask = () => {
    if (task.trim() === "") return;

    const updated = { ...tasksByDate };

    if (!updated[currentKey]) updated[currentKey] = [];

    updated[currentKey].push({ text: task, completed: false });

    setTasksByDate(updated);
    setTask("");
    setShowInput(false);
  };

  const toggleTask = (index) => {
    const updated = { ...tasksByDate };
    updated[currentKey][index].completed =
      !updated[currentKey][index].completed;
    setTasksByDate(updated);
  };

  // 📅 Calendar helpers
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const dates = Array.from(
    { length: getDaysInMonth(currentMonth, currentYear) },
    (_, i) => i + 1
  );

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // 🔁 Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="main">
      <div className="container">

        {/* LEFT CARD */}
        <div className="card left">
          <h3>
            {selectedDate.toDateString()}
            {formatDate(selectedDate) === formatDate(today) && (
              <span className="today-badge">Today</span>
            )}
          </h3>

          <div className="task-list">
            {tasks.map((t, index) => (
              <div key={index} className="task">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTask(index)}
                />
                <span className={t.completed ? "done" : ""}>
                  {t.text}
                </span>
              </div>
            ))}
          </div>

          {!showInput && (
            <button className="add-btn" onClick={() => setShowInput(true)}>
              + Add Task
            </button>
          )}

          {showInput && (
            <div className="add-task">
              <input
                type="text"
                placeholder="Enter task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button onClick={addTask}>Add</button>
            </div>
          )}
        </div>

        {/* RIGHT CARD */}
        <div className="card right">

          {/* HEADER WITH NAV */}
          <div className="calendar-header">
            <button onClick={prevMonth}>◀</button>
            <h3>{monthNames[currentMonth]} {currentYear}</h3>
            <button onClick={nextMonth}>▶</button>
          </div>

          <div className="calendar">
            <div className="days">
              {days.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className="dates">
              {dates.map((d, i) => {
                const dateObj = new Date(currentYear, currentMonth, d);
                const key = formatDate(dateObj);

                const isSelected =
                  formatDate(dateObj) === formatDate(selectedDate);

                const hasTasks = tasksByDate[key]?.length > 0;

                return (
                  <span
                    key={i}
                    className={isSelected ? "active" : ""}
                    onClick={() => setSelectedDate(dateObj)}
                  >
                    {d}
                    {hasTasks && <div className="dot"></div>}
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;