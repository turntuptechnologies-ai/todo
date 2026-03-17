import { useState, useMemo } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@todo/shared';
import { useTasks } from './hooks/use-tasks';
import { useCategories } from './hooks/use-categories';
import { useFilter } from './hooks/use-filter';
import { Sidebar } from './components/Sidebar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ConfirmDialog } from './components/ConfirmDialog';
import './App.css';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { filter, setCategoryId, setPriority, setCompleted, resetFilter, filterTasks } =
    useFilter();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredTasks = useMemo(() => filterTasks(tasks), [filterTasks, tasks]);

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

  const handleSelectCategory = (categoryId: string | null) => {
    setCategoryId(categoryId);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
  };

  return (
    <div className="app">
      <h1>todo</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="app__layout">
        <Sidebar
          categories={categories}
          selectedCategoryId={filter.categoryId}
          onSelectCategory={handleSelectCategory}
          onCreateCategory={createCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={handleDeleteCategory}
          filter={filter}
          onChangePriority={setPriority}
          onChangeCompleted={setCompleted}
          onResetFilter={resetFilter}
        />

        <main className="app__main">
          {!showForm && (
            <button type="button" className="app__add-button" onClick={() => setShowForm(true)}>
              + タスクを追加
            </button>
          )}

          {showForm && (
            <TaskForm
              editingTask={editingTask}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}

          {loading ? (
            <p className="app__loading">読み込み中...</p>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={toggleComplete}
              onEdit={handleEdit}
              onDelete={(id) => setDeletingTaskId(id)}
            />
          )}
        </main>
      </div>

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
