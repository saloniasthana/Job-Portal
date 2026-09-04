import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import JobCard from '../../components/jobs/JobCard';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { jobCategories } from '../../lib/format';

export default function JobsBoard() {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedJobs();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', { search, location, jobType, workMode, category }],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      if (workMode) params.workMode = workMode;
      if (category) params.category = category;
      return (await api.get('/jobs', { params })).data;
    },
  });

  const jobs = data?.jobs || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10 flex-1 w-full">
        <h1 className="font-display text-2xl font-semibold text-ink-50">
          {user ? `Welcome, ${user.name.split(' ')[0]} 👋` : 'Browse open roles'}
        </h1>
        <p className="mt-1 text-sm text-ink-400">Find a role that actually fits you.</p>

        <Card className="mt-6 p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
            <Input
              icon={Search}
              placeholder="Search title, skill, keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Input
              placeholder="Location"
              className="sm:w-40"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Select value={jobType} onChange={(e) => setJobType(e.target.value)} className="sm:w-40">
              <option value="">Any job type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </Select>
            <Select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="sm:w-36">
              <option value="">Any mode</option>
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Select
              value={category}
              onChange={(e) =>
                setSearchParams(e.target.value ? { category: e.target.value } : {}, { replace: true })
              }
              className="sm:w-56"
            >
              <option value="">Any category</option>
              {jobCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            {category && (
              <button
                onClick={() => setSearchParams({}, { replace: true })}
                className="text-xs text-ink-400 hover:text-ink-100"
              >
                Clear category
              </button>
            )}
          </div>
        </Card>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl glass-panel animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist/8">
                <SlidersHorizontal className="h-6 w-6 text-brand-300" />
              </span>
              <h2 className="mt-4 font-display font-semibold text-ink-100">No jobs match those filters</h2>
              <p className="mt-1.5 max-w-sm text-sm text-ink-400">
                Try widening your search or clearing a filter.
              </p>
            </Card>
          ) : (
            <>
              <p className="mb-4 text-xs text-ink-500">
                {data.pagination.total} open role{data.pagination.total === 1 ? '' : 's'}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    mode="candidate"
                    isSaved={isSaved(job._id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
