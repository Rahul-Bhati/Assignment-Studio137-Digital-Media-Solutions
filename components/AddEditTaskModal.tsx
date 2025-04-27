'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { X } from 'lucide-react';

interface AddEditTaskModalProps {
    mode: 'add' | 'edit';
    task?: Task | null;
    onClose: () => void;
    onSubmit: (task: Task) => void;
}

export default function AddEditTaskModal({ mode, task, onClose, onSubmit }: AddEditTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
    const [status, setStatus] = useState<'In Progress' | 'Completed'>('In Progress');

    
    useEffect(() => {
        if (mode === 'edit' && task) {
            console.log("task => ", task);
            setTitle(task.title);
            setDescription(task.description);
            // Convert dueDate to a string in YYYY-MM-DD format
            const date = new Date(task.dueDate);
            const formattedDate = date.toISOString().split('T')[0];
            setDueDate(formattedDate);
            // setDueDate(task.dueDate);
            setPriority(task.priority);
            setStatus(task.status);
        }
    }, [mode, task]);

    const handleSubmit = () => {
        if (title.trim() === '' || description.trim() === '' || dueDate.trim() === '') {
            alert('Please fill in all fields');
            return;
        }

        const newTask: Task = {
            id: task?.id || Math.floor(Math.random() * 100000),
            title,
            description,
            dueDate,
            priority,
            status,
        };

        onSubmit(newTask);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-120 shadow-lg relative">
                <div className="flex flex-row-reverse justify-between items-center mb-6">
                    <button onClick={onClose} className="text-gray-500 hover:text-black cursor-pointer">
                        <X size={20} className="font-bold" />
                    </button>

                    <h2 className="text-xl font-bold">
                        {mode === 'add' ? 'Add Task' : 'Edit Task'}
                    </h2>
                </div>
                <div className="space-y-4">
                {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="title"
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="description"
                            rows={3}
                            style={{ resize: 'none' }}
                        />
                    </div>
                    {/* Due Date */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Task['priority'])}
                            className="w-full border rounded p-2"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Task['status'])}
                            className="w-full border rounded p-2"
                        >
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            onClick={onClose}
                            className="border px-4 py-2 rounded border-[#941B0F] text-[#941B0F] cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="text-white px-4 py-2 rounded bg-[#941B0F] hover:bg-red-700 cursor-pointer"
                        >
                            {mode === 'add' ? 'Add Task' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
