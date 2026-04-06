import React, { useState } from 'react';
import { useApp } from '../../context/appContext';
import { ArrowLeft, Plus, Check, Trash2, Calendar, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';
import './TodoPage.css';

const DAYS = [
    { id: 'monday', label: 'Pazartesi' },
    { id: 'tuesday', label: 'Salı' },
    { id: 'wednesday', label: 'Çarşamba' },
    { id: 'thursday', label: 'Perşembe' },
    { id: 'friday', label: 'Cuma' },
    { id: 'saturday', label: 'Cumartesi' },
    { id: 'sunday', label: 'Pazar' }
];

const TodoPage = ({ onBack }) => {
    const { todos, saveTodos } = useApp();
    const [selectedDay, setSelectedDay] = useState('monday');
    const [newTask, setNewTask] = useState('');

    // todos structure: { monday: [{id, text, completed}], ... }

    const handleDownload = async () => {
        const element = document.querySelector('.todo-card');
        if (!element) return;

        try {
            const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-card')?.trim() || '#121c2f';
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: cardBg,
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `todo-list-${selectedDay}-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (err) {
            console.error('Screenshot failed:', err);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            text: newTask,
            completed: false
        };

        const updatedTodos = { ...todos };
        if (!updatedTodos[selectedDay]) updatedTodos[selectedDay] = [];
        updatedTodos[selectedDay] = [...updatedTodos[selectedDay], task];

        saveTodos(updatedTodos);
        setNewTask('');
    };

    const toggleTask = (taskId) => {
        const updatedTodos = { ...todos };
        updatedTodos[selectedDay] = updatedTodos[selectedDay].map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        saveTodos(updatedTodos);
    };

    const deleteTask = (taskId) => {
        const updatedTodos = { ...todos };
        updatedTodos[selectedDay] = updatedTodos[selectedDay].filter(t => t.id !== taskId);
        saveTodos(updatedTodos);
    };

    const currentTasks = todos[selectedDay] || [];
    const completedCount = currentTasks.filter(t => t.completed).length;

    return (
        <div className="todo-page fade-in">
            <header className="schedule-header">
                <div className="header-left">
                    <button onClick={onBack} className="btn-icon">
                        <ArrowLeft size={24} />
                    </button>
                    <h1>To-Do Listesi</h1>
                </div>
                <button className="btn-secondary" onClick={handleDownload} title="Listeyi İndir">
                    <Camera size={18} />
                </button>
            </header>

            <div className="day-selector-container">
                <div className="day-selector">
                    {DAYS.map(day => (
                        <button
                            key={day.id}
                            className={`day-btn ${selectedDay === day.id ? 'active' : ''}`}
                            onClick={() => setSelectedDay(day.id)}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="todo-container">
                <div className="todo-card">
                    <div className="todo-header">
                        <h2>{DAYS.find(d => d.id === selectedDay).label} Görevleri</h2>
                        <span className="task-count">{completedCount} / {currentTasks.length} Tamamlandı</span>
                    </div>

                    <form onSubmit={handleAddTask} className="add-task-form">
                        <input
                            type="text"
                            placeholder="Yeni görev ekle..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button type="submit" className="btn-secondary">
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="tasks-list">
                        {currentTasks.length === 0 && (
                            <div className="empty-tasks">
                                <Calendar size={48} className="empty-icon" />
                                <p>Bu gün için henüz bir görev yok.</p>
                            </div>
                        )}
                        {currentTasks.map(task => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <button
                                    className="check-btn"
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {task.completed && <Check size={16} />}
                                </button>
                                <span className="task-text" onClick={() => toggleTask(task.id)}>
                                    {task.text}
                                </span>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoPage;
