import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa6';
import Layout from '../components/layout';
import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
}

const CompletedTask: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const filteredTasks = data.filter((task: Task) => task.status === 'completed');
      setCompletedTasks(filteredTasks);
    } catch (error) {
      console.error('Failed to fetch completed tasks:', error);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error: ${response.status}`, errorBody);
        return;
      }
      fetchCompletedTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Layout>
      <div className='flex justify-between text-black'>
        <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
        <Link className='text-blue-500 hover:text-blue-700' href={'/'}>&lt; Back to Tasks</Link>
      </div>
      {completedTasks.length === 0 ? (
        <p className="text-gray-600 text-center">No Current Task/s Completed</p>
      ) : (
        <ul className="space-y-4">
          {completedTasks.map((task) => (
            <li key={task.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-lg text-black font-semibold">{task.title}</h3>
                <p className="text-gray-700">{task.description}</p>
                <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center mt-10 relative">
                  Priority:
                  <span
                    className={
                      task.priority === 'high'
                        ? 'text-red-500 font-semibold mx-1'
                        : task.priority === 'medium'
                        ? 'text-yellow-500 font-semibold mx-1'
                        : 'text-green-500 font-semibold mx-1'
                    }
                  >
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="mx-5"/>
                  Status:
                  <span
                    className={
                      task.status === 'pending'
                        ? 'text-blue-500 font-semibold mx-1'
                        : task.status === 'in_progress'
                        ? 'text-orange-500 font-semibold mx-1'
                        : 'text-green-600 font-semibold mx-1'
                    }
                  >
                    {task.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setTaskToDelete(task.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-700 flex items-center"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex text-black items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="bg-white rounded-lg p-6 z-10">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CompletedTask;