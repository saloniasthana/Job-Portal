import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus, Building2, Globe, MapPin, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CompanyFormModal from '../../components/jobs/CompanyFormModal';
import { api, getErrorMessage } from '../../lib/api';

export default function Companies() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deletingCompany, setDeletingCompany] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['myCompanies'],
    queryFn: async () => (await api.get('/companies/mine')).data.companies,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/companies/${id}`),
    onSuccess: () => {
      toast.success('Company deleted');
      queryClient.invalidateQueries({ queryKey: ['myCompanies'] });
      setDeletingCompany(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const companies = data || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-50">Your companies</h1>
            <p className="mt-1 text-sm text-ink-400">Manage the companies you post jobs under.</p>
          </div>
          <Button
            onClick={() => {
              setEditingCompany(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add company
          </Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl glass-panel animate-pulse" />
              ))}
            </div>
          ) : companies.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist/8">
                <Building2 className="h-6 w-6 text-brand-300" />
              </span>
              <h2 className="mt-4 font-display font-semibold text-ink-100">No companies yet</h2>
              <p className="mt-1.5 max-w-sm text-sm text-ink-400">
                Add a company profile so candidates know who's hiring when you post a job.
              </p>
              <Button className="mt-6" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" /> Add company
              </Button>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {companies.map((company) => (
                <Card key={company._id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400/80 to-amber-400/80 font-display font-semibold text-accent-ink">
                        {company.name[0]?.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-display font-semibold text-ink-50">{company.name}</h3>
                        {company.industry && <p className="truncate text-xs text-ink-400">{company.industry}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCompany(company);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setDeletingCompany(company)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {company.description && (
                    <p className="mt-4 text-sm text-ink-300 line-clamp-3">{company.description}</p>
                  )}

                  <div className="mt-4 space-y-1.5 text-xs text-ink-400">
                    {company.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {company.location}
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" /> {company.website}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <CompanyFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        company={editingCompany}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['myCompanies'] })}
      />

      <ConfirmDialog
        open={Boolean(deletingCompany)}
        onClose={() => setDeletingCompany(null)}
        onConfirm={() => deleteMutation.mutate(deletingCompany._id)}
        loading={deleteMutation.isPending}
        title="Delete company?"
        description={`This won't delete job postings already linked to "${deletingCompany?.name}", but they'll show without a company profile.`}
      />
    </div>
  );
}
