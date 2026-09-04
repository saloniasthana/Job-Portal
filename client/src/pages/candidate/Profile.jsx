import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FileText, Upload, Bookmark, ClipboardList, User as UserIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import JobCard from '../../components/jobs/JobCard';
import { api, getErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { formatSalary, timeAgo } from '../../lib/format';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  headline: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

const statusTones = {
  applied: 'neutral',
  shortlisted: 'brand',
  interview: 'amber',
  offer: 'mint',
  rejected: 'coral',
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'applied', label: 'Applied Jobs', icon: ClipboardList },
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
];

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('profile');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      headline: user?.headline || '',
      bio: user?.bio || '',
      skills: (user?.skills || []).join(', '),
    },
  });

  const onSubmit = async (values) => {
    try {
      await api.put('/users/profile', {
        ...values,
        skills: values.skills ? values.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      });
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Resume must be a PDF');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      await api.post('/users/resume', formData);
      await refreshUser();
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const { data: applications, isLoading: loadingApplications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => (await api.get('/applications/mine')).data.applications,
    enabled: tab === 'applied',
  });

  const { data: savedJobsData, isLoading: loadingSaved } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: async () => (await api.get('/users/saved-jobs')).data.jobs,
    enabled: tab === 'saved',
  });

  const { isSaved, toggleSave } = useSavedJobs();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-display text-2xl font-semibold text-ink-50">Your profile</h1>
        <p className="mt-1 text-sm text-ink-400">Manage your info, resume, and application history.</p>

        <div className="mt-6 flex gap-2 rounded-xl bg-ink-900/60 p-1 border border-mist/8 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={clsx(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                tab === id ? 'bg-brand-500 text-white' : 'text-ink-400 hover:text-ink-200'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_320px]">
            <Card>
              <h2 className="font-display font-semibold text-ink-100">Basic info</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <Input label="Full name" error={errors.name?.message} {...register('name')} />
                <Input label="Headline" placeholder="Frontend Engineer, 3 yrs" {...register('headline')} />
                <Textarea label="Bio" rows={4} placeholder="A short summary about you…" {...register('bio')} />
                <Input label="Skills (comma separated)" placeholder="React, Node.js, SQL" {...register('skills')} />
                <Button type="submit" loading={isSubmitting}>
                  Save changes
                </Button>
              </form>
            </Card>

            <Card>
              <h2 className="font-display font-semibold text-ink-100">Resume</h2>
              {user?.resume?.url ? (
                <a
                  href={user.resume.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center gap-3 rounded-xl border border-mist/10 bg-ink-900/60 p-3 hover:border-mist/20"
                >
                  <FileText className="h-8 w-8 shrink-0 text-brand-300" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-100">{user.resume.fileName}</p>
                    <p className="text-xs text-ink-500">
                      Uploaded {user.resume.uploadedAt ? timeAgo(user.resume.uploadedAt) : ''}
                    </p>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-ink-500" />
                </a>
              ) : (
                <p className="mt-4 text-sm text-ink-400">
                  No resume uploaded yet. You need one on file before you can apply to jobs.
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleResumeChange}
              />
              <Button
                variant="secondary"
                className="mt-4 w-full"
                loading={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> {user?.resume?.url ? 'Replace resume' : 'Upload resume'}
              </Button>
              <p className="mt-2 text-xs text-ink-500">PDF only, up to 5MB.</p>
            </Card>
          </div>
        )}

        {tab === 'applied' && (
          <div className="mt-6">
            {loadingApplications ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl glass-panel animate-pulse" />
                ))}
              </div>
            ) : !applications?.length ? (
              <Card className="flex flex-col items-center py-16 text-center">
                <ClipboardList className="h-8 w-8 text-ink-500" />
                <p className="mt-3 text-sm text-ink-400">You haven't applied to any jobs yet.</p>
                <Button as={Link} to="/jobs" className="mt-5">
                  Browse jobs
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <Card key={app._id} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <Link to={`/jobs/${app.job?._id}`} className="font-medium text-ink-100 hover:text-brand-300">
                        {app.job?.title || 'Job no longer available'}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {app.job?.company?.name || app.job?.recruiter?.company?.name || app.job?.recruiter?.name}
                        {' · '}
                        {formatSalary(app.job?.salaryMin, app.job?.salaryMax, app.job?.currency)}
                        {' · Applied '}
                        {timeAgo(app.createdAt)}
                      </p>
                    </div>
                    <Badge tone={statusTones[app.status]} className="capitalize shrink-0">
                      {app.status}
                    </Badge>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div className="mt-6">
            {loadingSaved ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl glass-panel animate-pulse" />
                ))}
              </div>
            ) : !savedJobsData?.length ? (
              <Card className="flex flex-col items-center py-16 text-center">
                <Bookmark className="h-8 w-8 text-ink-500" />
                <p className="mt-3 text-sm text-ink-400">You haven't saved any jobs yet.</p>
                <Button as={Link} to="/jobs" className="mt-5">
                  Browse jobs
                </Button>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedJobsData.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    mode="candidate"
                    isSaved={isSaved(job._id)}
                    onToggleSave={() => {
                      toggleSave(job);
                      setTimeout(
                        () => queryClient.invalidateQueries({ queryKey: ['savedJobs'] }),
                        300
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
