import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Wallet, Eye, Users, Pencil, Trash2, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatSalary, timeAgo, jobTypeLabels, workModeLabels } from '../../lib/format';

export default function JobCard({ job, mode = 'candidate', onEdit, onDelete, isSaved, onToggleSave }) {
  const companyName = job.company?.name || job.recruiter?.company?.name || job.recruiter?.name || 'A company';
  const initial = companyName[0]?.toUpperCase();

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="flex h-full flex-col hover:border-mist/16 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400/80 to-amber-400/80 font-display font-semibold text-accent-ink">
              {initial}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-display font-semibold text-ink-50">{job.title}</h3>
              <p className="truncate text-xs text-ink-400">{companyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {job.status === 'closed' && <Badge tone="coral">Closed</Badge>}
            {mode === 'candidate' && onToggleSave && (
              <button
                onClick={() => onToggleSave(job)}
                className={clsx(
                  'rounded-lg p-1.5 transition-colors',
                  isSaved ? 'text-amber-400 hover:bg-amber-500/10' : 'text-ink-500 hover:bg-mist/8 hover:text-ink-200'
                )}
                title={isSaved ? 'Remove from saved' : 'Save job'}
              >
                <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="brand">{jobTypeLabels[job.jobType]}</Badge>
          <Badge>{workModeLabels[job.workMode]}</Badge>
        </div>

        <div className="mt-4 space-y-1.5 text-sm text-ink-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ink-500" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-ink-500" />
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </div>
        </div>

        {job.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} tone="neutral">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && <Badge tone="neutral">+{job.skills.length - 4}</Badge>}
          </div>
        )}

        <div className="mt-auto pt-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {job.views ?? 0}
            </span>
            {mode === 'recruiter' && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {job.applicantCount ?? 0}
              </span>
            )}
            <span>{timeAgo(job.createdAt)}</span>
          </div>

          {mode === 'candidate' ? (
            <Button as={Link} to={`/jobs/${job._id}`} size="sm" variant="secondary">
              View details
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="ghost" onClick={() => onEdit(job)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(job)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
