import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { api, getErrorMessage } from '../../lib/api';
import { jobCategories } from '../../lib/format';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(20, 'Add a bit more detail (20+ characters)'),
  category: z.string().min(1),
  company: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  workMode: z.enum(['onsite', 'remote', 'hybrid']),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  skills: z.string().optional(),
  salaryMin: z.coerce.number().optional().or(z.literal('')),
  salaryMax: z.coerce.number().optional().or(z.literal('')),
});

const emptyDefaults = {
  title: '',
  description: '',
  category: 'Other',
  company: '',
  location: '',
  workMode: 'onsite',
  jobType: 'full-time',
  skills: '',
  salaryMin: '',
  salaryMax: '',
};

export default function JobFormModal({ open, onClose, job, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  const { data: companies } = useQuery({
    queryKey: ['myCompanies'],
    queryFn: async () => (await api.get('/companies/mine')).data.companies,
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset(
        job
          ? {
              title: job.title,
              description: job.description,
              category: job.category || 'Other',
              company: job.company?._id || '',
              location: job.location,
              workMode: job.workMode,
              jobType: job.jobType,
              skills: (job.skills || []).join(', '),
              salaryMin: job.salaryMin ?? '',
              salaryMax: job.salaryMax ?? '',
            }
          : emptyDefaults
      );
    }
  }, [open, job, reset]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      company: values.company || null,
      skills: values.skills
        ? values.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      salaryMin: values.salaryMin === '' ? null : Number(values.salaryMin),
      salaryMax: values.salaryMax === '' ? null : Number(values.salaryMax),
    };

    try {
      if (job) {
        await api.put(`/jobs/${job._id}`, payload);
        toast.success('Job posting updated');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posting published');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={job ? 'Edit job posting' : 'Post a new job'} wide>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Job title" placeholder="Frontend Engineer" error={errors.title?.message} {...register('title')} />

        <Textarea
          label="Description"
          rows={6}
          placeholder="Responsibilities, requirements, what makes this role great…"
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          label="Skills (comma separated)"
          placeholder="React, Node.js, MongoDB"
          {...register('skills')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select label="Category" error={errors.category?.message} {...register('category')}>
            {jobCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <div>
            <Select label="Company (optional)" {...register('company')}>
              <option value="">No company selected</option>
              {(companies || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
            {(companies || []).length === 0 && (
              <p className="mt-1.5 text-xs text-ink-500">
                <Link to="/recruiter/companies" className="text-brand-300 hover:text-brand-200">
                  Add a company
                </Link>{' '}
                to show its name/logo on this listing.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" placeholder="Bengaluru, India" error={errors.location?.message} {...register('location')} />
          <Select label="Work mode" error={errors.workMode?.message} {...register('workMode')}>
            <option value="onsite">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Select label="Job type" error={errors.jobType?.message} {...register('jobType')}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </Select>
          <Input label="Min salary (₹/yr)" type="number" placeholder="800000" {...register('salaryMin')} />
          <Input label="Max salary (₹/yr)" type="number" placeholder="1400000" {...register('salaryMax')} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {job ? 'Save changes' : 'Publish job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
