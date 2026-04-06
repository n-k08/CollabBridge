import { useState, useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { userApi } from '../services/endpoints';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SKILL_SUGGESTIONS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go', 'Rust',
  'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Flutter',
  'React Native', 'Vue.js', 'Angular', 'Django', 'FastAPI', 'GraphQL',
  'TensorFlow', 'PyTorch', 'Figma', 'Tailwind CSS', 'Redis', 'Firebase',
];

const INTEREST_SUGGESTIONS = [
  'Web Development', 'Mobile Development', 'AI', 'Machine Learning',
  'Data Science', 'DevOps', 'Cloud Computing', 'Cybersecurity',
  'Blockchain', 'Game Development', 'UI/UX Design', 'Open Source',
  'AR/VR', 'IoT', 'Startups', 'Research',
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', bio: '', skills: [], interests: [], techStack: [],
    experienceLevel: 'Beginner', availability: 'Part-time',
    github: '', linkedin: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills || [],
        interests: user.interests || [],
        techStack: user.techStack || [],
        experienceLevel: user.experienceLevel || 'Beginner',
        availability: user.availability || 'Part-time',
        github: user.github || '',
        linkedin: user.linkedin || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userApi.updateProfile(form);
      updateUser(res.user);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const addTag = (field, value, setInput) => {
    if (!value.trim()) return;
    if (!form[field].includes(value.trim())) {
      setForm({ ...form, [field]: [...form[field], value.trim()] });
    }
    setInput('');
  };

  const removeTag = (field, value) => {
    setForm({ ...form, [field]: form[field].filter((t) => t !== value) });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await userApi.uploadAvatar(formData);
      updateUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-slide-up">
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-success-light border border-success/30 text-success text-sm animate-fade-in">
          ✓ Profile updated successfully!
        </div>
      )}

      {/* Header Card */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar src={user?.avatar} name={user?.name} size="2xl" />
            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-text-primary">{user?.name}</h1>
            <p className="text-text-secondary text-sm mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant="accent">{user?.experienceLevel}</Badge>
              <Badge variant="success">{user?.availability}</Badge>
            </div>
          </div>
          <Button
            variant={editing ? 'danger' : 'secondary'}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="glass rounded-2xl p-6 space-y-6">
        {/* Bio */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">Bio</label>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none transition-all"
              rows={3}
              maxLength={500}
              placeholder="Tell others about yourself..."
            />
          ) : (
            <p className="text-sm text-text-primary">{user?.bio || 'No bio yet'}</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">Skills</label>
          {editing && (
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('skills', skillInput, setSkillInput))}
                className="flex-1 bg-bg-card border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-all"
                placeholder="Add a skill..."
                list="skill-suggestions"
              />
              <datalist id="skill-suggestions">
                {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <Button size="sm" onClick={() => addTag('skills', skillInput, setSkillInput)}>Add</Button>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {(editing ? form.skills : user?.skills || []).map((skill) => (
              <Badge key={skill} variant="accent">
                {skill}
                {editing && (
                  <button onClick={() => removeTag('skills', skill)} className="ml-1 hover:text-white cursor-pointer">×</button>
                )}
              </Badge>
            ))}
            {(!editing && !user?.skills?.length) && <span className="text-sm text-text-muted">No skills added</span>}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">Interests</label>
          {editing && (
            <div className="flex gap-2 mb-2">
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('interests', interestInput, setInterestInput))}
                className="flex-1 bg-bg-card border border-border rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-all"
                placeholder="Add an interest..."
                list="interest-suggestions"
              />
              <datalist id="interest-suggestions">
                {INTEREST_SUGGESTIONS.filter((i) => !form.interests.includes(i)).map((i) => (
                  <option key={i} value={i} />
                ))}
              </datalist>
              <Button size="sm" onClick={() => addTag('interests', interestInput, setInterestInput)}>Add</Button>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {(editing ? form.interests : user?.interests || []).map((interest) => (
              <Badge key={interest} variant="success">
                {interest}
                {editing && (
                  <button onClick={() => removeTag('interests', interest)} className="ml-1 hover:text-white cursor-pointer">×</button>
                )}
              </Badge>
            ))}
            {(!editing && !user?.interests?.length) && <span className="text-sm text-text-muted">No interests added</span>}
          </div>
        </div>

        {/* Experience & Availability */}
        {editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">Experience Level</label>
              <select
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                className="w-full bg-bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-all"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">Availability</label>
              <select
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full bg-bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-all"
              >
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>
          </div>
        )}

        {/* Links */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">Links</label>
          {editing ? (
            <div className="space-y-3">
              <Input
                placeholder="https://github.com/username"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>}
              />
              <Input
                placeholder="https://linkedin.com/in/username"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>}
              />
            </div>
          ) : (
            <div className="flex gap-3">
              {user?.github && (
                <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </a>
              )}
              {user?.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  LinkedIn
                </a>
              )}
              {!user?.github && !user?.linkedin && <span className="text-sm text-text-muted">No links added</span>}
            </div>
          )}
        </div>

        {/* Save Button */}
        {editing && (
          <div className="pt-4 border-t border-border">
            <Button onClick={handleSave} loading={saving} className="w-full" size="lg">
              Save Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
