/**
 * Level system configuration
 * Based on the original GamificationSystem from the vanilla JS version
 */

export interface LevelDefinition {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  perks: string[];
}

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    level: 1,
    name: 'Novato',
    minXP: 0,
    maxXP: 99,
    color: '#808080',
    perks: ['Acesso básico à plataforma'],
  },
  {
    level: 2,
    name: 'Aprendiz',
    minXP: 100,
    maxXP: 499,
    color: '#00ff88',
    perks: ['Tema Neon desbloqueado'],
  },
  {
    level: 3,
    name: 'Praticante',
    minXP: 500,
    maxXP: 1499,
    color: '#00ccff',
    perks: ['Tema Oceano desbloqueado', 'Estatísticas avançadas'],
  },
  {
    level: 4,
    name: 'Competente',
    minXP: 1500,
    maxXP: 3499,
    color: '#6a4ff0',
    perks: ['Tema Roxo desbloqueado', 'Calculadoras premium'],
  },
  {
    level: 5,
    name: 'Proficiente',
    minXP: 3500,
    maxXP: 7499,
    color: '#ff6600',
    perks: ['Tema Fogo desbloqueado', 'Relatórios semanais'],
  },
  {
    level: 6,
    name: 'Experiente',
    minXP: 7500,
    maxXP: 14999,
    color: '#ff3366',
    perks: ['Tema Vermelho desbloqueado', 'Análise de padrões'],
  },
  {
    level: 7,
    name: 'Avançado',
    minXP: 15000,
    maxXP: 29999,
    color: '#ffcc00',
    perks: ['Tema Ouro desbloqueado', 'Mentoria básica'],
  },
  {
    level: 8,
    name: 'Expert',
    minXP: 30000,
    maxXP: 49999,
    color: '#00ffcc',
    perks: ['Tema Cyber desbloqueado', 'Sala VIP'],
  },
  {
    level: 9,
    name: 'Mestre',
    minXP: 50000,
    maxXP: 74999,
    color: '#ff00ff',
    perks: ['Tema Matrix desbloqueado', 'Mentoria avançada'],
  },
  {
    level: 10,
    name: 'Lenda',
    minXP: 75000,
    maxXP: 100000,
    color: '#ffffff',
    perks: ['Todos os temas', 'Badge exclusivo', 'Acesso total'],
  },
];

/**
 * Get level info from XP amount
 */
export function getLevelFromXP(xp: number): LevelDefinition {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_DEFINITIONS[i].minXP) {
      return LEVEL_DEFINITIONS[i];
    }
  }
  return LEVEL_DEFINITIONS[0];
}

/**
 * Get level info by level number
 */
export function getLevelInfo(level: number): LevelDefinition {
  return LEVEL_DEFINITIONS[Math.min(level - 1, 9)] ?? LEVEL_DEFINITIONS[0];
}

/**
 * Calculate progress percentage within current level
 */
export function getLevelProgress(xp: number): number {
  const level = getLevelFromXP(xp);
  const xpInLevel = xp - level.minXP;
  const xpNeeded = level.maxXP - level.minXP + 1;
  return Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100);
}

/**
 * Get XP needed for next level
 */
export function getXPToNextLevel(xp: number): number {
  const level = getLevelFromXP(xp);
  if (level.level >= 10) return 0;
  return level.maxXP + 1 - xp;
}

/**
 * XP rewards for different actions
 */
export const XP_REWARDS = {
  TRADE_REGISTERED: 10,
  TRADE_WINNING: 20,
  PERFECT_CHECKLIST: 50,
  WEEKLY_REVIEW: 100,
  MONTHLY_REPORT: 200,
  CHALLENGE_DAY: 50,
  CHALLENGE_COMPLETE: 500,
  BADGE_EARNED: 25,
} as const;

export type XPRewardType = keyof typeof XP_REWARDS;
