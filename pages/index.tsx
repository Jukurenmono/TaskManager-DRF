import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { FaEdit, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import Layout from '../components/layout';
import AddTaskModal from '../components/addTask';
import EditTaskModal from '../components/editTask';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToConfirmComplete, setTaskToConfirmComplete] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const filteredTasks = data.filter((task: Task) => task.status !== 'completed');
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (task: { title: string; description: string; priority: string; status: string }) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleEditClick = (task: Task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (task: { id: number; title: string; description: string; priority: string; }) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error: ${response.status}`, errorBody);
        return;
      }

      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

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

      fetchTasks();
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

  const handleStatusChange = (task: Task, newStatus: string) => {
    if (newStatus === 'completed') {
      setTaskToConfirmComplete(task);
      setIsConfirmCompleteOpen(true);
    } else {
      const updatedTask = { ...task, status: newStatus };
      handleUpdateTask(updatedTask);
    }
  };

  const confirmCompleteTask = () => {
    if (taskToConfirmComplete) {
      const updatedTask = { ...taskToConfirmComplete, status: 'completed' };
      handleUpdateTask(updatedTask);
      setTaskToConfirmComplete(null);
      setIsConfirmCompleteOpen(false);
    }
  };

  return (
    <Layout>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <h2 className="text-xl font-semibold text-black">Tasks</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="ml-2 bg-green-500 text-white p-1 rounded-md"
          >
            <FaPlus size={15} />
          </button>
        </div>
        <Link className='text-blue-500 hover:text-blue-700' href={'/completedTask'}>
          Completed Tasks &gt;
        </Link>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg text-black font-semibold">{task.title}</h3>
              <p className="text-gray-700">{task.description}</p>
              <div className="text-sm text-gray-500 flex flex-col md:flex-row md:items-center mt-10 relative">
                Priority:
                <span
                  className={task.priority === 'high'
                    ? 'text-red-500 font-semibold mx-1'
                    : task.priority === 'medium'
                      ? 'text-yellow-500 font-semibold mx-1'
                      : 'text-green-500 font-semibold mx-1'
                  }
                >
                  {task.priority.toUpperCase()}
                </span>
                <span className="mx-5" />
                Status:
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value)}
                  className="ml-2 border border-gray-300 rounded-md p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                
                <span className={`mx-2 h-2 w-2 rounded-full 
                  ${task.status === 'pending' ? 'bg-gray-500' : 
                  task.status === 'in_progress' ? 'bg-blue-500' : 'bg-green-500'}`} />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(task)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <FaEdit size={20} />
              </button>
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

      {isConfirmCompleteOpen && (
        <div className="fixed inset-0 flex text-black items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsConfirmCompleteOpen(false)} />
          <div className="bg-white rounded-lg p-6 z-10">
            <h2 className="text-lg font-semibold mb-4">Confirm Completion</h2>
            <p>Are you sure you want to mark this task as completed?</p>
            <p><b>NOTICE</b>: This action cannot be undo once confirmed.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsConfirmCompleteOpen(false)}
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmCompleteTask}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
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

      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddTask={handleAddTask} />
      <EditTaskModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} task={currentTask} onUpdateTask={handleUpdateTask} />
    </Layout>
  );
};

export default Home;
