import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus, Briefcase, Eye, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import JobCard from '../../components/jobs/JobCard';
import JobFormModal from '../../components/jobs/JobFormModal';
import { api, getErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['myJobs'],
    queryFn: async () => (await api.get('/jobs/mine')).data.jobs,
  });

  const deleteMutation = useMutation({
    mutationFn: (jobId) => api.delete(`/jobs/${jobId}`),
    onSuccess: () => {
      toast.success('Job posting deleted');
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      setDeletingJob(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const jobs = data || [];
  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === 'open').length,
    views: jobs.reduce((sum, j) => sum + (j.views || 0), 0),
    applicants: jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0),
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-50">
              Welcome, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-ink-400">
              {user?.company?.name ? `${user.company.name} · ` : ''}Your recruiter dashboard.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingJob(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Post a job
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Open postings', value: stats.open, icon: Briefcase },
            { label: 'Total postings', value: stats.total, icon: Briefcase },
            { label: 'Total views', value: stats.views, icon: Eye },
            { label: 'Applicants', value: stats.applicants, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="p-4">
              <div className="flex items-center gap-2 text-ink-400">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </div>
              <p className="mt-2 font-display text-2xl font-semibold text-ink-50">{value}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl glass-panel animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist/8">
                <Briefcase className="h-6 w-6 text-brand-300" />
              </span>
              <h2 className="mt-4 font-display font-semibold text-ink-100">No job postings yet</h2>
              <p className="mt-1.5 max-w-sm text-sm text-ink-400">
                Post your first opening and candidates will be able to find and apply to it.
              </p>
              <Button className="mt-6" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" /> Post a job
              </Button>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  mode="recruiter"
                  onEdit={(j) => {
                    setEditingJob(j);
                    setFormOpen(true);
                  }}
                  onDelete={(j) => setDeletingJob(j)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <JobFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        job={editingJob}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['myJobs'] })}
      />

      <ConfirmDialog
        open={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        onConfirm={() => deleteMutation.mutate(deletingJob._id)}
        loading={deleteMutation.isPending}
        title="Delete job posting?"
        description={`This will permanently remove "${deletingJob?.title}". This can't be undone.`}
      />
    </div>
  );
}
