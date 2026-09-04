import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useSavedJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['savedJobIds'],
    queryFn: async () => (await api.get('/users/saved-jobs')).data.jobs.map((j) => j._id),
    enabled: user?.role === 'candidate',
    staleTime: 60_000,
  });

  const toggleMutation = useMutation({
    mutationFn: (jobId) => api.post(`/users/saved-jobs/${jobId}`),
    onSuccess: (res) => {
      toast.success(res.data.saved ? 'Saved to your list' : 'Removed from saved');
      queryClient.invalidateQueries({ queryKey: ['savedJobIds'] });
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const savedIds = data || [];

  return {
    savedIds,
    isSaved: (jobId) => savedIds.includes(jobId),
    toggleSave: (job) => {
      if (!user) {
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      if (user.role !== 'candidate') {
        toast.error('Only candidate accounts can save jobs');
        return;
      }
      toggleMutation.mutate(job._id);
    },
  };
}
