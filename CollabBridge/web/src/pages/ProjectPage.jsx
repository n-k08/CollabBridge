import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useProjectStore from '../stores/useProjectStore';
import useMatchStore from '../stores/useMatchStore';
import useAuthStore from '../stores/useAuthStore';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'text-text-secondary', bgIcon: 'bg-bg-hover' },
  { id: 'in_progress', label: 'In Progress', color: 'text-warning', bgIcon: 'bg-amber-500/10' },
  { id: 'completed', label: 'Completed', color: 'text-success', bgIcon: 'bg-success/10' },
];

export default function ProjectPage() {
  const { id } = useParams();
  const { currentProject, fetchProject, createTask, updateTask, deleteTask, inviteMember, loading } = useProjectStore();
  const { matches, fetchMatches } = useMatchStore();
  const { user } = useAuthStore();
  const [showAddTask, setShowAddTask] = useState(null); // column id
  const [showInvite, setShowInvite] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [creating, setCreating] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchProject(id);
    fetchMatches();
  }, [id]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    setCreating(true);
    try {
      await createTask(id, { ...newTask, status: showAddTask });
      setShowAddTask(null);
      setNewTask({ title: '', description: '', priority: 'medium' });
    } catch {}
    setCreating(false);
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }
    try {
      await updateTask(id, draggedTask._id, { status: newStatus });
    } catch {}
    setDraggedTask(null);
  };

  const handleInvite = async (userId) => {
    try {
      await inviteMember(id, userId);
      setShowInvite(false);
    } catch {}
  };

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  };

  if (loading && !currentProject) return <Spinner className="py-20" size="lg" />;
  if (!currentProject) return <div className="text-center py-20 text-text-muted">Project not found</div>;

  const tasks = currentProject.tasks || [];
  const isOwner = currentProject.owner?._id === user?._id;

  // Get matched users not in project for invite
  const invitableUsers = matches
    .flatMap((m) => m.users || [])
    .filter((u) => u._id !== user?._id && !currentProject.members?.some((m) => m._id === u._id));
  const uniqueInvitable = invitableUsers.filter((u, i, arr) => arr.findIndex((x) => x._id === u._id) === i);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{currentProject.name}</h1>
          <p className="text-text-secondary text-sm mt-1">{currentProject.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Members */}
          <div className="flex -space-x-2">
            {currentProject.members?.map((member) => (
              <Avatar key={member._id} src={member.avatar} name={member.name} size="sm" />
            ))}
          </div>
          {isOwner && (
            <Button variant="secondary" size="sm" onClick={() => setShowInvite(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Invite
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-2xl bg-bg-secondary border border-border p-4 min-h-[400px] transition-all ${
                draggedTask && draggedTask.status !== col.id ? 'border-accent/30 bg-accent/5' : ''
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${col.bgIcon} flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${col.color}`}>{columnTasks.length}</span>
                  </div>
                  <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                </div>
                <button
                  onClick={() => setShowAddTask(col.id)}
                  className="w-7 h-7 rounded-lg bg-bg-hover hover:bg-bg-card flex items-center justify-center text-text-muted hover:text-text-primary transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-2.5">
                {columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={() => setDraggedTask(null)}
                    className={`glass rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-accent/30 transition-all group ${
                      draggedTask?._id === task._id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-text-primary leading-snug">{task.title}</h4>
                      <button
                        onClick={() => deleteTask(id, task._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-muted hover:text-danger transition-all cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2.5">
                      <Badge variant={priorityColors[task.priority]} className="text-[10px]">
                        {task.priority}
                      </Badge>
                      {task.assignee && (
                        <Avatar src={task.assignee.avatar} name={task.assignee.name} size="sm" />
                      )}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-text-muted text-xs">
                    <p>No tasks</p>
                    <p className="mt-1">Drag tasks here or click + to add</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={!!showAddTask} onClose={() => setShowAddTask(null)} title="Add Task">
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="What needs to be done?"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none transition-all"
              rows={2}
              placeholder="Optional description..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  onClick={() => setNewTask({ ...newTask, priority: p })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer ${
                    newTask.priority === p
                      ? p === 'high' ? 'bg-danger text-white' : p === 'medium' ? 'bg-warning text-white' : 'bg-success text-white'
                      : 'bg-bg-card text-text-secondary border border-border hover:border-border-light'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleCreateTask} loading={creating} className="w-full">
            Add Task
          </Button>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Collaborator">
        {uniqueInvitable.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">
            No matched users available to invite. Match with more partners first!
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uniqueInvitable.map((u) => (
              <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-bg-card hover:bg-bg-hover transition-all">
                <div className="flex items-center gap-3">
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{u.name}</p>
                    <p className="text-xs text-text-muted">{u.experienceLevel}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleInvite(u._id)}>Invite</Button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
