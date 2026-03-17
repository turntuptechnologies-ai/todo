import { useState, useEffect } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@todo/shared';
import { Priority } from '@todo/shared';

type Props = {
  editingTask: Task | null;
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => void;
  onCancel: () => void;
};

export function TaskForm({ editingTask, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? '');
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
      setDueDate('');
    }
  }, [editingTask]);

  const isValid = title.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    if (editingTask) {
      const input: UpdateTaskInput = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        dueDate: dueDate || null,
      };
      onSubmit(input);
    } else {
      const input: CreateTaskInput = {
        title: title.trim(),
        ...(description.trim() && { description: description.trim() }),
        priority,
        ...(dueDate && { dueDate }),
      };
      onSubmit(input);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-title">
          タイトル <span className="task-form__required">*</span>
        </label>
        <input
          id="task-title"
          className="task-form__input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクのタイトル"
        />
      </div>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-description">
          説明
        </label>
        <textarea
          id="task-description"
          className="task-form__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="タスクの説明（任意）"
          rows={3}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">
            優先度
          </label>
          <select
            id="task-priority"
            className="task-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value={Priority.LOW}>低</option>
            <option value={Priority.MEDIUM}>中</option>
            <option value={Priority.HIGH}>高</option>
          </select>
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-due-date">
            期限
          </label>
          <input
            id="task-due-date"
            className="task-form__input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="task-form__actions">
        <button
          type="button"
          className="task-form__button task-form__button--cancel"
          onClick={onCancel}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="task-form__button task-form__button--submit"
          disabled={!isValid}
        >
          {editingTask ? '更新' : '作成'}
        </button>
      </div>
    </form>
  );
}
