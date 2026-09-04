import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Wallet, Eye, Briefcase, Bookmark, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { api, getErrorMessage } from '../../lib/api';
import { formatSalary, timeAgo, jobTypeLabels, workModeLabels } from '../../lib/format';
import { useAuth } from '../../context/AuthContext';
import { useSavedJobs } from '../../hooks/useSavedJobs';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isSaved, toggleSave } = useSavedJobs();

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => (await api.get(`/jobs/${id}`)).data.job,
  });

  const { data: myApplications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => (await api.get('/applications/mine')).data.applications,
    enabled: user?.role === 'candidate',
  });

  const applyMutation = useMutation({
    mutationFn: () => api.post('/applications', { jobId: id }),
    onSuccess: () => {
      toast.success('Application submitted');
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (error) toast.error(getErrorMessage(error));

  const companyName = data?.company?.name || data?.recruiter?.company?.name || data?.recruiter?.name;
  const hasApplied = myApplications?.some((a) => a.job?._id === id);

  const handleApply = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (user.role !== 'candidate') {
      toast.error('Only candidate accounts can apply to jobs');
      return;
    }
    if (!user.resume?.url) {
      toast.error('Upload a resume to your profile before applying');
      navigate('/profile');
      return;
    }
    applyMutation.mutate();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to jobs
        </Link>

        {isLoading ? (
          <div className="mt-6 h-80 rounded-2xl glass-panel animate-pulse" />
        ) : !data ? (
          <Card className="mt-6 flex flex-col items-center py-16 text-center">
            <Briefcase className="h-8 w-8 text-ink-500" />
            <p className="mt-3 text-sm text-ink-400">This job posting couldn't be found.</p>
          </Card>
        ) : (
          <Card className="mt-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-4 min-w-0">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400/80 to-amber-400/80 font-display text-xl font-semibold text-accent-ink">
                  {companyName?.[0]?.toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-semibold text-ink-50">{data.title}</h1>
                  <p className="mt-1 text-sm text-ink-400">
                    {companyName} · Posted {timeAgo(data.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSave(data)}
                className={clsx(
                  'shrink-0 rounded-lg p-2 transition-colors',
                  isSaved(data._id)
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : 'text-ink-500 hover:bg-mist/8 hover:text-ink-200'
                )}
                title={isSaved(data._id) ? 'Remove from saved' : 'Save job'}
              >
                <Bookmark className="h-5 w-5" fill={isSaved(data._id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              <Badge tone="brand">{jobTypeLabels[data.jobType]}</Badge>
              <Badge>{workModeLabels[data.workMode]}</Badge>
              {data.category && <Badge tone="amber">{data.category}</Badge>}
              {data.status === 'closed' && <Badge tone="coral">Closed</Badge>}
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-ink-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-ink-500" /> {data.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-ink-500" />
                {formatSalary(data.salaryMin, data.salaryMax, data.currency)}
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-ink-500" /> {data.views} views
              </div>
            </div>

            {data.skills?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {data.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            )}

            {data.company?.description && (
              <div className="mt-6 border-t border-mist/8 pt-6">
                <h2 className="font-display font-semibold text-ink-100">About {data.company.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">{data.company.description}</p>
              </div>
            )}

            <div className="mt-6 border-t border-mist/8 pt-6">
              <h2 className="font-display font-semibold text-ink-100">About this role</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-300">
                {data.description}
              </p>
            </div>

            <div className="mt-8">
              {hasApplied ? (
                <Button size="lg" variant="secondary" disabled className="w-full sm:w-auto">
                  <CheckCircle2 className="h-4 w-4 text-mint-500" /> Applied
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  loading={applyMutation.isPending}
                  onClick={handleApply}
                  disabled={data.status === 'closed'}
                >
                  {data.status === 'closed' ? 'Applications closed' : 'Apply now'}
                </Button>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
