import { useState } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@todo/shared';
import { useTasks } from './hooks/use-tasks';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ConfirmDialog } from './components/ConfirmDialog';
import './App.css';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (input: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      await updateTask(editingTask.id, input as UpdateTaskInput);
      setEditingTask(null);
    } else {
      await createTask(input as CreateTaskInput);
    }
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const handleDeleteConfirm = async () => {
    if (deletingTaskId) {
      await deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  return (
    <div className="app">
      <h1>todo</h1>

      {error && <p className="error-message">{error}</p>}

      {!showForm && (
        <button
          type="button"
          className="app__add-button"
          onClick={() => setShowForm(true)}
        >
          + タスクを追加
        </button>
      )}

      {showForm && (
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {loading ? (
        <p className="app__loading">読み込み中...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onEdit={handleEdit}
          onDelete={(id) => setDeletingTaskId(id)}
        />
      )}

      {deletingTaskId && (
        <ConfirmDialog
          message="このタスクを削除しますか？"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTaskId(null)}
        />
      )}
    </div>
  );
}

export default App;
