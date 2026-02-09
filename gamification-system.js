// ====================================================================
// SISTEMA DE GAMIFICAÇÃO - MENTORA AI
// XP, Níveis, Badges e Achievements
// ====================================================================

class GamificationSystem {
    constructor() {
        this.user = this.loadUserData();
        this.levels = this.initializeLevels();
        this.badges = this.initializeBadges();
        this.achievements = this.initializeAchievements();
    }

    // ================================================================
    // SISTEMA DE NÍVEIS
    // ================================================================
    
    initializeLevels() {
        return [
            {
                level: 1,
                name: "Novato",
                xpRequired: 0,
                icon: "🌱",
                color: "#888888",
                description: "Dando os primeiros passos",
                benefits: ["Acesso ao dashboard", "Registro de trades"]
            },
            {
                level: 2,
                name: "Aprendiz",
                xpRequired: 500,
                icon: "📚",
                color: "#00ff88",
                description: "Começando a entender o jogo",
                benefits: ["Tema 'Bull Market' desbloqueado", "Badge 'Primeira Semana'"]
            },
            {
                level: 3,
                name: "Praticante",
                xpRequired: 1500,
                icon: "⚔️",
                color: "#00ccff",
                description: "Ganhando experiência real",
                benefits: ["Análise semanal automática", "Acesso a desafios"]
            },
            {
                level: 4,
                name: "Competente",
                xpRequired: 3500,
                icon: "🎯",
                color: "#9b6fff",
                description: "Trader com fundamento sólido",
                benefits: ["Tema 'Cybertrade' desbloqueado", "Relatórios mensais"]
            },
            {
                level: 5,
                name: "Proficiente",
                xpRequired: 7000,
                icon: "💎",
                color: "#ffaa00",
                description: "Alto nível de habilidade",
                benefits: ["Badge 'Consistente'", "Prioridade no suporte"]
            },
            {
                level: 6,
                name: "Especialista",
                xpRequired: 12000,
                icon: "🏆",
                color: "#ff6b9d",
                description: "Domínio comprovado",
                benefits: ["Certificado de Excelência", "Consultor Exclusivo"]
            },
            {
                level: 7,
                name: "Mestre",
                xpRequired: 20000,
                icon: "👑",
                color: "#ffd700",
                description: "Entre os melhores",
                benefits: ["Tema 'Wall Street' desbloqueado", "Grupo VIP"]
            },
            {
                level: 8,
                name: "Grão-Mestre",
                xpRequired: 35000,
                icon: "⚡",
                color: "#00ffff",
                description: "Elite do trading",
                benefits: ["Badge 'Elite'", "Mentoria reversa (você ensina)"]
            },
            {
                level: 9,
                name: "Campeão",
                xpRequired: 60000,
                icon: "🌟",
                color: "#ff3366",
                description: "Performance excepcional",
                benefits: ["Certificado Pro", "Destaque na comunidade"]
            },
            {
                level: 10,
                name: "Lenda",
                xpRequired: 100000,
                icon: "🔱",
                color: "#a020f0",
                description: "Lendário",
                benefits: ["Tema exclusivo 'Lendário'", "Hall da Fama"]
            }
        ];
    }

    // ================================================================
    // SISTEMA DE BADGES
    // ================================================================
    
    initializeBadges() {
        return {
            // CATEGORIA: PRIMEIROS PASSOS
            primeiros_passos: [
                {
                    id: "primeiro_trade",
                    name: "Primeiro Trade",
                    description: "Registrou sua primeira operação",
                    icon: "🎯",
                    rarity: "comum",
                    xp: 50,
                    condition: (user) => user.trades.length >= 1
                },
                {
                    id: "primeira_semana",
                    name: "Primeira Semana",
                    description: "7 dias consecutivos usando o sistema",
                    icon: "📅",
                    rarity: "comum",
                    xp: 100,
                    condition: (user) => user.stats.daysActive >= 7
                },
                {
                    id: "primeiro_mes",
                    name: "Primeiro Mês",
                    description: "30 dias consecutivos no sistema",
                    icon: "📆",
                    rarity: "raro",
                    xp: 300,
                    condition: (user) => user.stats.daysActive >= 30
                }
            ],

            // CATEGORIA: DISCIPLINA
            disciplina: [
                {
                    id: "checklist_perfeito",
                    name: "Checklist Perfeito",
                    description: "Completou 10 checklists sem pular nenhum item",
                    icon: "✅",
                    rarity: "comum",
                    xp: 150,
                    condition: (user) => user.stats.perfectChecklists >= 10
                },
                {
                    id: "disciplinado",
                    name: "Trader Disciplinado",
                    description: "Score de disciplina acima de 90% por 7 dias",
                    icon: "🛡️",
                    rarity: "raro",
                    xp: 400,
                    condition: (user) => user.stats.disciplineStreak >= 7
                },
                {
                    id: "inabalavel",
                    name: "Inabalável",
                    description: "30 dias sem quebrar nenhuma regra pessoal",
                    icon: "💪",
                    rarity: "epico",
                    xp: 800,
                    condition: (user) => user.stats.noRuleBreakStreak >= 30
                }
            ],

            // CATEGORIA: CONSISTÊNCIA
            consistencia: [
                {
                    id: "consistente",
                    name: "Consistente",
                    description: "Win rate acima de 60% em 20 trades",
                    icon: "📈",
                    rarity: "raro",
                    xp: 500,
                    condition: (user) => {
                        const lastTrades = user.trades.slice(-20);
                        const wins = lastTrades.filter(t => t.resultado > 0).length;
                        return lastTrades.length >= 20 && (wins / lastTrades.length) >= 0.6;
                    }
                },
                {
                    id: "semana_verde",
                    name: "Semana Verde",
                    description: "5 dias lucrativos seguidos",
                    icon: "🟢",
                    rarity: "comum",
                    xp: 200,
                    condition: (user) => user.stats.greenDayStreak >= 5
                },
                {
                    id: "mes_lucrativo",
                    name: "Mês Lucrativo",
                    description: "Terminou o mês no positivo",
                    icon: "💰",
                    rarity: "raro",
                    xp: 600,
                    condition: (user) => user.stats.profitableMonths >= 1
                }
            ],

            // CATEGORIA: VOLUME
            volume: [
                {
                    id: "cem_trades",
                    name: "Centenário",
                    description: "100 trades registrados",
                    icon: "💯",
                    rarity: "comum",
                    xp: 300,
                    condition: (user) => user.trades.length >= 100
                },
                {
                    id: "quinhentos_trades",
                    name: "Veterano",
                    description: "500 trades registrados",
                    icon: "🎖️",
                    rarity: "raro",
                    xp: 1000,
                    condition: (user) => user.trades.length >= 500
                },
                {
                    id: "mil_trades",
                    name: "Mestre dos Mil",
                    description: "1000 trades registrados",
                    icon: "🏅",
                    rarity: "epico",
                    xp: 2500,
                    condition: (user) => user.trades.length >= 1000
                }
            ],

            // CATEGORIA: ESPECIAIS
            especiais: [
                {
                    id: "madrugador",
                    name: "Madrugador",
                    description: "Operou antes das 6h da manhã 10 vezes",
                    icon: "🌅",
                    rarity: "raro",
                    xp: 400,
                    condition: (user) => user.stats.earlyBirdTrades >= 10
                },
                {
                    id: "aproveitador",
                    name: "Aproveitador",
                    description: "Usou todos os 6 gráficos em um dia",
                    icon: "📊",
                    rarity: "comum",
                    xp: 150,
                    condition: (user) => user.stats.usedAllCharts
                },
                {
                    id: "sabio",
                    name: "Sábio",
                    description: "Fez 50 perguntas para a IA Mentora",
                    icon: "🧠",
                    rarity: "raro",
                    xp: 500,
                    condition: (user) => user.stats.aiQuestions >= 50
                }
            ],

            // CATEGORIA: STREAKS
            streaks: [
                {
                    id: "streak_7",
                    name: "Semana Perfeita",
                    description: "7 dias seguidos operando",
                    icon: "🔥",
                    rarity: "comum",
                    xp: 250,
                    condition: (user) => user.stats.loginStreak >= 7
                },
                {
                    id: "streak_30",
                    name: "Mês Dedicado",
                    description: "30 dias seguidos operando",
                    icon: "🔥🔥",
                    rarity: "raro",
                    xp: 800,
                    condition: (user) => user.stats.loginStreak >= 30
                },
                {
                    id: "streak_90",
                    name: "Trimestre Implacável",
                    description: "90 dias seguidos operando",
                    icon: "🔥🔥🔥",
                    rarity: "epico",
                    xp: 2000,
                    condition: (user) => user.stats.loginStreak >= 90
                }
            ],

            // CATEGORIA: ELITE
            elite: [
                {
                    id: "rei_do_score",
                    name: "Rei do Score",
                    description: "Score de disciplina 100% em um dia",
                    icon: "👑",
                    rarity: "epico",
                    xp: 1000,
                    condition: (user) => user.stats.perfectScoreDay
                },
                {
                    id: "desafio_completo",
                    name: "Desafiador",
                    description: "Completou o Desafio 30 Dias",
                    icon: "🏆",
                    rarity: "epico",
                    xp: 1500,
                    condition: (user) => user.challenges.thirtyDayComplete
                },
                {
                    id: "fundador",
                    name: "Membro Fundador",
                    description: "Entre os primeiros 100 usuários",
                    icon: "🌟",
                    rarity: "lendario",
                    xp: 5000,
                    condition: (user) => user.userId <= 100
                }
            ]
        };
    }

    // ================================================================
    // TABELA DE XP POR AÇÃO
    // ================================================================
    
    getXPRewards() {
        return {
            // TRADES
            tradeRegistered: 10,
            winningTrade: 20,
            losingTradeWithNotes: 15,
            checklistComplete: 25,
            perfectChecklist: 50,
            followedAllRules: 30,

            // ANÁLISE
            postTradeReflection: 20,
            aiConversation: 15,
            weeklyReview: 100,
            monthlyReport: 200,

            // CONSISTÊNCIA
            greenDay: 40,
            weekGreen: 150,
            monthProfitable: 500,

            // SISTEMA
            dailyLogin: 5,
            weekStreak: 100,
            profileComplete: 50,
            firstTimeUsing: 30,

            // SOCIAL (futuro)
            challengeComplete: 500,
            helpOtherUser: 50,
            sharedAchievement: 25
        };
    }

    // ================================================================
    // FUNÇÕES PRINCIPAIS
    // ================================================================
    
    addXP(amount, reason) {
        this.user.xp += amount;
        this.user.xpHistory.push({
            amount,
            reason,
            timestamp: new Date().toISOString(),
            totalXP: this.user.xp
        });

        this.checkLevelUp();
        this.checkBadges();
        this.saveUserData();

        return {
            xpGained: amount,
            newTotal: this.user.xp,
            leveledUp: false
        };
    }

    checkLevelUp() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.levels.find(l => l.level === currentLevel.level + 1);

        if (nextLevel && this.user.xp >= nextLevel.xpRequired) {
            this.levelUp(nextLevel);
            return true;
        }
        return false;
    }

    levelUp(newLevel) {
        const oldLevel = this.getCurrentLevel();
        this.user.level = newLevel.level;

        // Notificar usuário
        this.showLevelUpNotification(oldLevel, newLevel);

        // Desbloquear benefícios
        this.unlockLevelBenefits(newLevel);

        return newLevel;
    }

    getCurrentLevel() {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (this.user.xp >= this.levels[i].xpRequired) {
                return this.levels[i];
            }
        }
        return this.levels[0];
    }

    getNextLevel() {
        const current = this.getCurrentLevel();
        return this.levels.find(l => l.level === current.level + 1) || null;
    }

    getProgressToNextLevel() {
        const current = this.getCurrentLevel();
        const next = this.getNextLevel();

        if (!next) {
            return 100; // Max level
        }

        const currentLevelXP = current.xpRequired;
        const nextLevelXP = next.xpRequired;
        const xpInCurrentLevel = this.user.xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;

        return Math.floor((xpInCurrentLevel / xpNeeded) * 100);
    }

    checkBadges() {
        const allBadges = Object.values(this.badges).flat();
        const newBadges = [];

        allBadges.forEach(badge => {
            const alreadyHas = this.user.badges.some(b => b.id === badge.id);
            
            if (!alreadyHas && badge.condition(this.user)) {
                this.awardBadge(badge);
                newBadges.push(badge);
            }
        });

        return newBadges;
    }

    awardBadge(badge) {
        this.user.badges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            rarity: badge.rarity,
            awardedAt: new Date().toISOString()
        });

        // Adicionar XP do badge
        this.addXP(badge.xp, `Badge: ${badge.name}`);

        // Notificar usuário
        this.showBadgeNotification(badge);

        this.saveUserData();
    }

    // ================================================================
    // UI NOTIFICATIONS
    // ================================================================
    
    showLevelUpNotification(oldLevel, newLevel) {
        const modal = document.createElement('div');
        modal.className = 'level-up-modal';
        modal.innerHTML = `
            <div class="level-up-content">
                <h2>🎉 LEVEL UP!</h2>
                <div class="level-transition">
                    <div class="old-level">
                        <span class="level-icon">${oldLevel.icon}</span>
                        <span class="level-name">${oldLevel.name}</span>
                    </div>
                    <div class="arrow">→</div>
                    <div class="new-level" style="color: ${newLevel.color}">
                        <span class="level-icon">${newLevel.icon}</span>
                        <span class="level-name">${newLevel.name}</span>
                    </div>
                </div>
                <p class="level-description">${newLevel.description}</p>
                <div class="benefits">
                    <h3>Benefícios Desbloqueados:</h3>
                    <ul>
                        ${newLevel.benefits.map(b => `<li>✅ ${b}</li>`).join('')}
                    </ul>
                </div>
                <button onclick="closeLevelUpModal()" class="btn-close">Continuar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = `badge-notification rarity-${badge.rarity}`;
        notification.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-info">
                <h4>Badge Desbloqueado!</h4>
                <p class="badge-name">${badge.name}</p>
                <p class="badge-desc">${badge.description}</p>
                <p class="xp-reward">+${badge.xp} XP</p>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // ================================================================
    // DATA MANAGEMENT
    // ================================================================
    
    loadUserData() {
        const saved = localStorage.getItem('gamification');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            userId: Date.now(),
            xp: 0,
            level: 1,
            badges: [],
            xpHistory: [],
            stats: {
                daysActive: 0,
                loginStreak: 0,
                perfectChecklists: 0,
                disciplineStreak: 0,
                noRuleBreakStreak: 0,
                greenDayStreak: 0,
                profitableMonths: 0,
                earlyBirdTrades: 0,
                usedAllCharts: false,
                aiQuestions: 0,
                perfectScoreDay: false
            },
            challenges: {
                thirtyDayComplete: false
            }
        };
    }

    saveUserData() {
        localStorage.setItem('gamification', JSON.stringify(this.user));
    }

    resetProgress() {
        if (confirm('Tem certeza que deseja resetar todo o progresso de gamificação? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('gamification');
            this.user = this.loadUserData();
            alert('Progresso resetado!');
            location.reload();
        }
    }
}

// ================================================================
// HELPER FUNCTIONS
// ================================================================

function closeLevelUpModal() {
    document.querySelector('.level-up-modal')?.remove();
}

function getRarityColor(rarity) {
    const colors = {
        comum: '#888888',
        raro: '#00ccff',
        epico: '#9b6fff',
        lendario: '#ffd700'
    };
    return colors[rarity] || '#888888';
}

// ================================================================
// EXPORT
// ================================================================

// Inicializar sistema global
if (typeof window !== 'undefined') {
    window.gamification = new GamificationSystem();
}

// Para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}
