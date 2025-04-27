'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, ListFilter, SquarePen, Trash2, X } from 'lucide-react';
import AddEditTaskModal from './AddEditTaskModal';

export default function TasksTable({ tasks }: { tasks: Task[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'title' | 'dueDate' | 'priority'>('dueDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterByStatus, setFilterByStatus] = useState<'all' | 'completed' | 'in-progress'>('all');
    const [filterByPriority, setFilterByPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

    const [allTasks, setTasks] = useState<Task[]>(tasks);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const router = useRouter();

    const openDeleteModal = (task: Task) => {
        setSelectedTask(task);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedTask(null);
    };

    // For Add
    const openAddModal = () => {
        setModalMode('add');
        setEditingTask(null); // Clear the editing task
        setShowAddEditModal(true);
    };

    // For Edit
    const openEditModal = (task: Task) => {
        setModalMode('edit');
        setEditingTask(task);
        setShowAddEditModal(true);
    };

    const handleAddEditSubmit = (task: Task) => {
        if (modalMode === 'add') {
            // Add the new task to the task list
            setTasks((prevTasks) => [...prevTasks, task]);
        } else if (modalMode === 'edit' && editingTask) {
            // Edit the existing task
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === editingTask.id ? task : t))
            );
        }
        setShowAddEditModal(false); // Close the modal after submitting
    };

    const handleDelete = async () => {
        if (selectedTask) {
            // Remove the task from the list
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== selectedTask.id)
            );
            closeDeleteModal();
            router.refresh(); // Optional: Refresh the page if needed
        }
    };

    const handleSortDueDate = () => {
        setSortBy('dueDate');
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Handle filtering by status
    const handleSortByStatus = () => {
        // setFilterByStatus(status);
    };

    // Handle filtering by priority
    const handleSortByPriorityFilter = (priority: 'all' | 'low' | 'medium' | 'high') => {
        setFilterByPriority(priority);
        allTasks.filter(task => task.priority.toLowerCase() === priority);

        setTasks(allTasks);
    };

    useEffect(() => {
        // Sorting and filtering logic
        let filteredTasks = [...tasks];

        if (filterByStatus !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status.toLowerCase() === filterByStatus);
        }

        if (filterByPriority !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority.toLowerCase() === filterByPriority);
        }

        if (sortBy === 'dueDate') {
            filteredTasks.sort((a, b) => {
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            });
        }

        console.log(filteredTasks);
        setTasks(filteredTasks);
    }, [sortBy, sortOrder, filterByStatus, filterByPriority, tasks]);

    return (
        <>
            <div className="flex justify-between items-center gap-2 mb-6">
                <div className="text-2xl font-bold">Tasks</div>
                <div className="flex gap-2">
                    <button className="bg-[#941B0F] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded font-['Proxima_Nova'] cursor-pointer" onClick={openAddModal} >
                        + Add Task
                    </button>
                    <button className="flex items-center border-[#941B0F] text-[#941B0F] border font-semibold py-2 px-4 rounded font-['Proxima_Nova'] cursor-pointer" onClick={handleSortDueDate}>
                        <ArrowUpDown className='mr-3' size={20} /> Sort
                    </button>
                    <div
                        className="flex items-center border-[#941B0F] text-[#941B0F] border font-semibold py-2 px-4 rounded font-['Proxima_Nova'] cursor-pointer"
                    >
                        <ListFilter className="mr-3" size={20} />
                        <select
                            value={filterByPriority} // Bind the current selected value
                            onChange={(e) => handleSortByPriorityFilter(e.target.value as 'low' | 'medium' | 'high' | 'all')} // Update the filter based on selection
                            className="p-1 bg-white cursor-pointer"
                        >
                            <option value="all">Filter</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-x-auto border-[#941B0F] border-1">
                <table className="min-w-full">
                    <thead className="bg-[#FFF9F8]">
                        <tr className="text-left text-[#941B0F] ">
                            <th className="py-3 px-4">SL.No</th>
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTasks.map((task, idx) => (
                            <tr key={task.id} className={`${idx % 2 == 0 ? "bg-white" : "bg-[#FFF9F8]"} border-t py-4`}>
                                <td className="py-3 px-3">{idx + 1}</td>
                                <td className="py-3 px-3">{task.title}</td>
                                <td className="py-3 px-3 text-gray-500 max-w-xs truncate">
                                    {task.description}
                                </td>
                                <td className="py-3 px-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs text-white font-semibold ${task.status === 'Completed'
                                            ? 'bg-[#03A229] '
                                            : 'bg-[#F5D20E]'
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </td>
                                <td className="py-3 px-3">
                                    <select
                                        defaultValue={task.priority}
                                        className="border rounded p-1 bg-white cursor-pointer"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </td>
                                <td className="py-3 px-3 flex gap-2 items-center justify-center self-center">
                                    <button className="cursor-pointer" onClick={() => openEditModal(task)}><SquarePen size={18} /></button>
                                    <button
                                        onClick={() => openDeleteModal(task)}
                                        className="cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Delete Modal */}
                {showDeleteModal && selectedTask && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-120 shadow-lg">
                            <div className='flex flex-row-reverse justify-between items-start mb-2'>
                                <button
                                    onClick={closeDeleteModal}
                                    className="text-gray-500 hover:text-black cursor-pointer"
                                >
                                    <X size={20} className='font-bold' />
                                </button>
                                <h2 className="text-lg font-bold mb-4 w-[80%]">
                                    Are you sure that you wish to delete this task?
                                </h2>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={closeDeleteModal}
                                    className="border px-4 py-2 rounded border-[#941B0F] text-[#941B0F] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-[#941B0F] text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Modal */}
                {showAddEditModal && (
                    <AddEditTaskModal
                        mode={modalMode}
                        task={editingTask}
                        onClose={() => setShowAddEditModal(false)}
                        onSubmit={handleAddEditSubmit}
                    />
                )}
            </div>
        </>
    );
}
