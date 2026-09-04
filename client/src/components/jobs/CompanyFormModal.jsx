import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { api, getErrorMessage } from '../../lib/api';

const schema = z.object({
  name: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
});

const emptyDefaults = { name: '', industry: '', location: '', website: '', description: '' };

export default function CompanyFormModal({ open, onClose, company, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (open) reset(company || emptyDefaults);
  }, [open, company, reset]);

  const onSubmit = async (values) => {
    try {
      if (company) {
        await api.put(`/companies/${company._id}`, values);
        toast.success('Company updated');
      } else {
        await api.post('/companies', values);
        toast.success('Company created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={company ? 'Edit company' : 'Add a company'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Company name" placeholder="TechNova" error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Industry" placeholder="Software / SaaS" {...register('industry')} />
          <Input label="Location" placeholder="Bengaluru, India" {...register('location')} />
        </div>
        <Input label="Website" placeholder="https://technova.dev" {...register('website')} />
        <Textarea label="About" rows={4} placeholder="What does this company do?" {...register('description')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {company ? 'Save changes' : 'Add company'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
