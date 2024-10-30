import { useState } from 'react';

interface AddTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { title: string; description: string; priority: string; status: string }) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({ title, description, priority, status });
    setTitle('')
    setDescription('')
    setPriority('')
    setStatus('')
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex text-black items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
          </select>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Add Task
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full p-2 bg-red-600 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default AddTask;
