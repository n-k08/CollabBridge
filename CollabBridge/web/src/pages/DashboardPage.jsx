import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProjectStore from '../stores/useProjectStore';
import useMatchStore from '../stores/useMatchStore';
import useAuthStore from '../stores/useAuthStore';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const { projects, fetchProjects, createProject, loading } = useProjectStore();
  const { matches, fetchMatches } = useMatchStore();
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchMatches();
  }, []);

  const handleCreate = async () => {
    if (!newProject.name.trim()) return;
    setCreating(true);
    try {
      await createProject(newProject);
      setShowCreate(false);
      setNewProject({ name: '', description: '' });
    } catch {}
    setCreating(false);
  };

  if (loading && projects.length === 0) return <Spinner className="py-20" size="lg" />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your projects and collaborations</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{projects.length}</p>
              <p className="text-xs text-text-muted">Active Projects</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{matches.length}</p>
              <p className="text-xs text-text-muted">Matches</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {new Set(projects.flatMap((p) => p.members?.map((m) => m._id) || [])).size}
              </p>
              <p className="text-xs text-text-muted">Collaborators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-bg-card flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No projects yet</h3>
          <p className="text-text-secondary text-sm mb-4">Create a project to start collaborating!</p>
          <Button onClick={() => setShowCreate(true)}>Create First Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <Link
              key={project._id}
              to={`/project/${project._id}`}
              className="glass rounded-2xl p-5 hover:border-accent/30 transition-all duration-300 group animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">{project.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{project.description?.slice(0, 80) || 'No description'}</p>
                </div>
                <Badge variant={project.status === 'active' ? 'success' : 'default'}>{project.status}</Badge>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 5).map((member) => (
                    <Avatar key={member._id} src={member.avatar} name={member.name} size="sm" />
                  ))}
                  {project.members?.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-bg-hover flex items-center justify-center text-xs text-text-muted ring-2 ring-bg-primary">
                      +{project.members.length - 5}
                    </div>
                  )}
                </div>
                <span className="text-xs text-text-muted">{project.members?.length} member{project.members?.length !== 1 ? 's' : ''}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="My Awesome Project"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none transition-all"
              rows={3}
              placeholder="What's this project about?"
            />
          </div>
          <Button onClick={handleCreate} loading={creating} className="w-full">
            Create Project
          </Button>
        </div>
      </Modal>
    </div>
  );
}
