"use client";
import TasksTable from '@/components/TasksTable';
import { Search } from 'lucide-react';
import { getTasks } from '@/lib/tasks';
import { useState } from 'react';

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState(getTasks);
  const [filteredTasks, setFilteredTasks] = useState(getTasks);

  const handleSearch = (query:string) => {
    setSearchQuery(query);
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  return (
    <main className="min-h-screen bg-white p-4 text-black">
      <div className="max-w-7xl mx-auto font-['Proxima_Nova']">
        <header className="flex flex-col justify-between mb-6">
          <div className="flex justify-between items-center gap-2 mb-4">
            <h1 className="text-3xl font-bold">Studio137</h1>

            <div className="relative w-full md:w-64 border border-gray-200 rounded-lg py-2">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <input
                placeholder="Search"
                className="pl-8 w-full focus:outline-none focus:ring-0"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <TasksTable tasks={filteredTasks} />
      </div>
    </main>
  );
}
