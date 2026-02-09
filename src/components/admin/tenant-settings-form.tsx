'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTenantSettingsAction } from '@/app/(dashboard)/dashboard/admin/actions';
import type { TenantAdminDTO } from '@/lib/utils/dto';

type Props = {
  tenant: TenantAdminDTO;
};

export function TenantSettingsForm({ tenant }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: tenant.name,
    logoUrl: tenant.logoUrl || '',
    primaryColor: tenant.primaryColor,
    secondaryColor: tenant.secondaryColor,
    customDomain: tenant.customDomain || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateTenantSettingsAction({
        name: formData.name,
        logoUrl: formData.logoUrl || null,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        customDomain: formData.customDomain || null,
      });
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-glass p-6 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">Personalização</h2>

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/50 text-[var(--accent-primary)]">
          Configurações salvas com sucesso!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome da Empresa
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
            required
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            URL do Logo
          </label>
          <input
            type="url"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            placeholder="https://exemplo.com/logo.png"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>

        {/* Colors */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Cor Primária
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="flex-1 px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Cor Secundária
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="flex-1 px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 rounded-lg bg-muted/30">
          <label className="block text-sm font-medium mb-2">Preview</label>
          <div className="flex gap-4 items-center">
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: formData.primaryColor }}
            />
            <div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: formData.secondaryColor }}
            />
            <span
              className="font-bold"
              style={{
                background: `linear-gradient(135deg, ${formData.primaryColor} 0%, ${formData.secondaryColor} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formData.name}
            </span>
          </div>
        </div>

        {/* Custom Domain */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Domínio Personalizado
          </label>
          <input
            type="text"
            value={formData.customDomain}
            onChange={(e) =>
              setFormData({ ...formData, customDomain: e.target.value })
            }
            placeholder="app.suaempresa.com.br"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Configure o DNS do seu domínio para apontar para nossa plataforma
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            color: 'var(--bg-primary)',
          }}
        >
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </form>
  );
}
