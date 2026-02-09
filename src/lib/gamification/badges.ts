/**
 * Badge definitions for the gamification system
 * Based on the original GamificationSystem from the vanilla JS version
 */

export type BadgeCategory =
  | 'trades'
  | 'streaks'
  | 'xp'
  | 'challenge'
  | 'special'
  | 'community'
  | 'mastery';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  requirement: string;
  xpReward: number;
}

export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  // Trades Badges
  first_trade: {
    id: 'first_trade',
    name: 'Primeiro Trade',
    description: 'Registrou seu primeiro trade',
    icon: '🎯',
    category: 'trades',
    requirement: 'Registrar 1 trade',
    xpReward: 50,
  },
  trader_10: {
    id: 'trader_10',
    name: 'Trader Iniciante',
    description: 'Registrou 10 trades',
    icon: '📊',
    category: 'trades',
    requirement: 'Registrar 10 trades',
    xpReward: 100,
  },
  trader_50: {
    id: 'trader_50',
    name: 'Trader Ativo',
    description: 'Registrou 50 trades',
    icon: '📈',
    category: 'trades',
    requirement: 'Registrar 50 trades',
    xpReward: 250,
  },
  trader_100: {
    id: 'trader_100',
    name: 'Trader Dedicado',
    description: 'Registrou 100 trades',
    icon: '🏆',
    category: 'trades',
    requirement: 'Registrar 100 trades',
    xpReward: 500,
  },
  trader_500: {
    id: 'trader_500',
    name: 'Trader Profissional',
    description: 'Registrou 500 trades',
    icon: '💎',
    category: 'trades',
    requirement: 'Registrar 500 trades',
    xpReward: 1000,
  },

  // Streak Badges
  streak_3: {
    id: 'streak_3',
    name: 'Sequência Inicial',
    description: '3 trades vencedores seguidos',
    icon: '🔥',
    category: 'streaks',
    requirement: '3 trades vencedores consecutivos',
    xpReward: 75,
  },
  streak_5: {
    id: 'streak_5',
    name: 'Em Chamas',
    description: '5 trades vencedores seguidos',
    icon: '🔥🔥',
    category: 'streaks',
    requirement: '5 trades vencedores consecutivos',
    xpReward: 150,
  },
  streak_10: {
    id: 'streak_10',
    name: 'Imparável',
    description: '10 trades vencedores seguidos',
    icon: '⚡',
    category: 'streaks',
    requirement: '10 trades vencedores consecutivos',
    xpReward: 500,
  },
  streak_20: {
    id: 'streak_20',
    name: 'Lendário',
    description: '20 trades vencedores seguidos',
    icon: '👑',
    category: 'streaks',
    requirement: '20 trades vencedores consecutivos',
    xpReward: 1500,
  },

  // XP/Level Badges
  level_2: {
    id: 'level_2',
    name: 'Aprendiz',
    description: 'Alcançou o nível 2',
    icon: '⭐',
    category: 'xp',
    requirement: 'Alcançar nível 2 (100 XP)',
    xpReward: 0,
  },
  level_5: {
    id: 'level_5',
    name: 'Proficiente',
    description: 'Alcançou o nível 5',
    icon: '⭐⭐',
    category: 'xp',
    requirement: 'Alcançar nível 5 (3500 XP)',
    xpReward: 0,
  },
  level_10: {
    id: 'level_10',
    name: 'Lenda',
    description: 'Alcançou o nível máximo',
    icon: '🌟',
    category: 'xp',
    requirement: 'Alcançar nível 10 (100000 XP)',
    xpReward: 0,
  },
  xp_1000: {
    id: 'xp_1000',
    name: 'Mil XP',
    description: 'Acumulou 1000 XP',
    icon: '💰',
    category: 'xp',
    requirement: 'Acumular 1000 XP',
    xpReward: 100,
  },
  xp_10000: {
    id: 'xp_10000',
    name: 'Dez Mil XP',
    description: 'Acumulou 10000 XP',
    icon: '💎',
    category: 'xp',
    requirement: 'Acumular 10000 XP',
    xpReward: 500,
  },

  // Challenge Badges
  challenge_started: {
    id: 'challenge_started',
    name: 'Desafio Aceito',
    description: 'Iniciou o Desafio 30 Dias',
    icon: '🚀',
    category: 'challenge',
    requirement: 'Iniciar o Desafio 30 Dias',
    xpReward: 50,
  },
  challenge_week1: {
    id: 'challenge_week1',
    name: 'Primeira Semana',
    description: 'Completou 7 dias do desafio',
    icon: '📅',
    category: 'challenge',
    requirement: 'Completar 7 dias do desafio',
    xpReward: 200,
  },
  challenge_week2: {
    id: 'challenge_week2',
    name: 'Duas Semanas',
    description: 'Completou 14 dias do desafio',
    icon: '📆',
    category: 'challenge',
    requirement: 'Completar 14 dias do desafio',
    xpReward: 300,
  },
  challenge_complete: {
    id: 'challenge_complete',
    name: 'Desafio Completo',
    description: 'Completou o Desafio 30 Dias',
    icon: '🏅',
    category: 'challenge',
    requirement: 'Completar todos os 30 dias',
    xpReward: 1000,
  },

  // Win Rate Badges
  winrate_50: {
    id: 'winrate_50',
    name: 'Equilibrado',
    description: 'Taxa de acerto de 50%+ (mín. 20 trades)',
    icon: '⚖️',
    category: 'mastery',
    requirement: '50%+ win rate com 20+ trades',
    xpReward: 100,
  },
  winrate_60: {
    id: 'winrate_60',
    name: 'Consistente',
    description: 'Taxa de acerto de 60%+ (mín. 50 trades)',
    icon: '📊',
    category: 'mastery',
    requirement: '60%+ win rate com 50+ trades',
    xpReward: 300,
  },
  winrate_70: {
    id: 'winrate_70',
    name: 'Mestre',
    description: 'Taxa de acerto de 70%+ (mín. 100 trades)',
    icon: '🎖️',
    category: 'mastery',
    requirement: '70%+ win rate com 100+ trades',
    xpReward: 750,
  },

  // Special Badges
  early_bird: {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Trade antes das 7h',
    icon: '🌅',
    category: 'special',
    requirement: 'Registrar trade antes das 7h',
    xpReward: 25,
  },
  night_owl: {
    id: 'night_owl',
    name: 'Coruja',
    description: 'Trade após as 22h',
    icon: '🦉',
    category: 'special',
    requirement: 'Registrar trade após as 22h',
    xpReward: 25,
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    name: 'Guerreiro de Fim de Semana',
    description: 'Trade no fim de semana',
    icon: '⚔️',
    category: 'special',
    requirement: 'Registrar trade no sábado ou domingo',
    xpReward: 50,
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Semana Perfeita',
    description: '5 dias de trades vencedores',
    icon: '✨',
    category: 'special',
    requirement: '5 dias consecutivos com trades vencedores',
    xpReward: 500,
  },
};

/**
 * Get badges by category
 */
export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return Object.values(BADGE_DEFINITIONS).filter(
    (badge) => badge.category === category
  );
}

/**
 * Get all badge categories
 */
export function getAllCategories(): BadgeCategory[] {
  return ['trades', 'streaks', 'xp', 'challenge', 'mastery', 'special', 'community'];
}

/**
 * Get category display name
 */
export function getCategoryName(category: BadgeCategory): string {
  const names: Record<BadgeCategory, string> = {
    trades: 'Trades',
    streaks: 'Sequências',
    xp: 'Experiência',
    challenge: 'Desafios',
    mastery: 'Maestria',
    special: 'Especiais',
    community: 'Comunidade',
  };
  return names[category];
}
