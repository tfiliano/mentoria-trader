import { z } from 'zod';

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  tenantSlug: z.string().min(1, 'Tenant é obrigatório'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
  tenantSlug: z.string().min(1, 'Tenant é obrigatório'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  tenantSlug: z.string().min(1, 'Tenant é obrigatório'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  avatarUrl: z.string().url('URL inválida').optional().nullable(),
});

// ============================================================================
// GAMIFICATION SCHEMAS
// ============================================================================

export const addXPSchema = z.object({
  amount: z.number().min(1, 'XP deve ser positivo').max(1000, 'XP máximo é 1000'),
  reason: z.string().min(1, 'Motivo é obrigatório').max(100, 'Motivo muito longo'),
});

export const registerTradeSchema = z.object({
  isWinning: z.boolean(),
  notes: z.string().max(500, 'Notas muito longas').optional(),
});

// ============================================================================
// CHALLENGE SCHEMAS
// ============================================================================

export const completeChallengeDay = z.object({
  challengeId: z.string().min(1, 'Challenge ID é obrigatório'),
  dayNumber: z.number().min(1).max(30),
  notes: z.string().max(1000, 'Notas muito longas').optional(),
});

// ============================================================================
// TENANT SCHEMAS (Admin only)
// ============================================================================

export const createTenantSchema = z.object({
  slug: z.string()
    .min(3, 'Slug deve ter no mínimo 3 caracteres')
    .max(50, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  logoUrl: z.string().url('URL inválida').optional().nullable(),
  customDomain: z.string().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  plan: z.enum(['starter', 'pro', 'enterprise']).optional(),
});

export const updateTenantSchema = createTenantSchema.partial().omit({ slug: true });

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddXPInput = z.infer<typeof addXPSchema>;
export type RegisterTradeInput = z.infer<typeof registerTradeSchema>;
export type CompleteChallengeDay = z.infer<typeof completeChallengeDay>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
