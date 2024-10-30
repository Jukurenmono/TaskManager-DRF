import { useEffect, useState } from 'react';

interface EditTaskProps {
  isOpen: boolean;
  onClose: () => void;
  task: { id: number; title: string; description: string; priority: string;} | null;
  onUpdateTask: (task: { id: number; title: string; description: string; priority: string;}) => void;
}

const EditTask: React.FC<EditTaskProps> = ({ isOpen, onClose, task, onUpdateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onUpdateTask({ id: task.id, title, description, priority});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex text-black items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
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
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Update Task
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full p-2 bg-red-600 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default EditTask;
