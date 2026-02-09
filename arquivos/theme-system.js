// ====================================================================
// SISTEMA DE TEMAS - MENTORA AI
// Temas Desbloqueáveis por Nível
// ====================================================================

class ThemeSystem {
    constructor() {
        this.themes = this.initializeThemes();
        this.currentTheme = this.loadCurrentTheme();
        this.applyTheme(this.currentTheme);
    }

    initializeThemes() {
        return {
            // TEMA PADRÃO (NÍVEL 1)
            default: {
                id: 'default',
                name: 'Dark Mode',
                description: 'Tema padrão profissional',
                rarity: 'comum',
                levelRequired: 1,
                icon: '🌑',
                preview: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
                colors: {
                    bgPrimary: '#0a0a0a',
                    bgSecondary: '#1a1a1a',
                    bgTertiary: '#2a2a2a',
                    textPrimary: '#ffffff',
                    textSecondary: '#b0b0b0',
                    accentPrimary: '#00ff88',
                    accentSecondary: '#00ccff',
                    accentDanger: '#ff3366',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }
            },

            // TEMA BULL MARKET (NÍVEL 2)
            bull_market: {
                id: 'bull_market',
                name: 'Bull Market',
                description: 'Verde e dourado - para momentos de vitória',
                rarity: 'raro',
                levelRequired: 2,
                icon: '📈',
                preview: 'linear-gradient(135deg, #00ff88, #ffd700)',
                colors: {
                    bgPrimary: '#0a120a',
                    bgSecondary: '#0f1f0f',
                    bgTertiary: '#1a2e1a',
                    textPrimary: '#e8ffe8',
                    textSecondary: '#9fd89f',
                    accentPrimary: '#00ff88',
                    accentSecondary: '#ffd700',
                    accentDanger: '#ff6b6b',
                    borderColor: 'rgba(0, 255, 136, 0.2)'
                }
            },

            // TEMA CYBERTRADE (NÍVEL 4)
            cybertrade: {
                id: 'cybertrade',
                name: 'Cybertrade',
                description: 'Neon roxo - estilo cyberpunk',
                rarity: 'epico',
                levelRequired: 4,
                icon: '⚡',
                preview: 'linear-gradient(135deg, #9b6fff, #ff00ff)',
                colors: {
                    bgPrimary: '#0a0a14',
                    bgSecondary: '#14141f',
                    bgTertiary: '#1f1f2e',
                    textPrimary: '#e8e8ff',
                    textSecondary: '#b8b8d8',
                    accentPrimary: '#9b6fff',
                    accentSecondary: '#ff00ff',
                    accentDanger: '#ff3d8a',
                    borderColor: 'rgba(155, 111, 255, 0.3)'
                }
            },

            // TEMA WALL STREET (NÍVEL 7)
            wall_street: {
                id: 'wall_street',
                name: 'Wall Street',
                description: 'Azul e prata - elegância profissional',
                rarity: 'epico',
                levelRequired: 7,
                icon: '🏛️',
                preview: 'linear-gradient(135deg, #1e3a8a, #c0c0c0)',
                colors: {
                    bgPrimary: '#0a0f1a',
                    bgSecondary: '#0f1729',
                    bgTertiary: '#1a2438',
                    textPrimary: '#e8f0ff',
                    textSecondary: '#9db4d8',
                    accentPrimary: '#3b82f6',
                    accentSecondary: '#c0c0c0',
                    accentDanger: '#ef4444',
                    borderColor: 'rgba(59, 130, 246, 0.2)'
                }
            },

            // TEMA BLOOD RED (NÍVEL 5)
            blood_red: {
                id: 'blood_red',
                name: 'Blood Red',
                description: 'Vermelho intenso - para os corajosos',
                rarity: 'raro',
                levelRequired: 5,
                icon: '🔴',
                preview: 'linear-gradient(135deg, #8b0000, #ff0000)',
                colors: {
                    bgPrimary: '#140a0a',
                    bgSecondary: '#1f0f0f',
                    bgTertiary: '#2e1a1a',
                    textPrimary: '#ffe8e8',
                    textSecondary: '#d89f9f',
                    accentPrimary: '#ff3366',
                    accentSecondary: '#ff6b9d',
                    accentDanger: '#ff0000',
                    borderColor: 'rgba(255, 51, 102, 0.2)'
                }
            },

            // TEMA GOLDEN TRADE (NÍVEL 6)
            golden_trade: {
                id: 'golden_trade',
                name: 'Golden Trade',
                description: 'Dourado luxuoso - riqueza e prosperidade',
                rarity: 'epico',
                levelRequired: 6,
                icon: '👑',
                preview: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                colors: {
                    bgPrimary: '#1a1510',
                    bgSecondary: '#241f15',
                    bgTertiary: '#332e1f',
                    textPrimary: '#fff8e8',
                    textSecondary: '#d8c89f',
                    accentPrimary: '#ffd700',
                    accentSecondary: '#ffed4e',
                    accentDanger: '#ff8c00',
                    borderColor: 'rgba(255, 215, 0, 0.2)'
                }
            },

            // TEMA LEGENDARY (NÍVEL 10)
            legendary: {
                id: 'legendary',
                name: 'Legendary',
                description: 'Exclusivo para Lendas - aurora boreal',
                rarity: 'lendario',
                levelRequired: 10,
                icon: '🔱',
                preview: 'linear-gradient(135deg, #00ffff, #ff00ff, #ffff00)',
                colors: {
                    bgPrimary: '#0a0a14',
                    bgSecondary: '#14141f',
                    bgTertiary: '#1f1f2e',
                    textPrimary: '#ffffff',
                    textSecondary: '#c8c8ff',
                    accentPrimary: '#00ffff',
                    accentSecondary: '#ff00ff',
                    accentDanger: '#ff3d8a',
                    borderColor: 'rgba(0, 255, 255, 0.3)'
                },
                special: 'animated-gradient'
            },

            // TEMA OCEAN BLUE (DESAFIO 30 DIAS)
            ocean_blue: {
                id: 'ocean_blue',
                name: 'Ocean Blue',
                description: 'Desbloqueado no Desafio 30 Dias',
                rarity: 'epico',
                levelRequired: 3,
                unlockCondition: 'challenge_30_complete',
                icon: '🌊',
                preview: 'linear-gradient(135deg, #006994, #00d4ff)',
                colors: {
                    bgPrimary: '#0a1419',
                    bgSecondary: '#0f1f29',
                    bgTertiary: '#1a2e38',
                    textPrimary: '#e8f8ff',
                    textSecondary: '#9fd8e8',
                    accentPrimary: '#00d4ff',
                    accentSecondary: '#006994',
                    accentDanger: '#ff6b6b',
                    borderColor: 'rgba(0, 212, 255, 0.2)'
                }
            },

            // TEMA MINT GREEN (WIN RATE +70%)
            mint_green: {
                id: 'mint_green',
                name: 'Mint Green',
                description: 'Desbloqueado com Win Rate acima de 70%',
                rarity: 'epico',
                levelRequired: 4,
                unlockCondition: 'winrate_70',
                icon: '🍃',
                preview: 'linear-gradient(135deg, #00ff88, #00ffcc)',
                colors: {
                    bgPrimary: '#0a1914',
                    bgSecondary: '#0f291f',
                    bgTertiary: '#1a382e',
                    textPrimary: '#e8fff8',
                    textSecondary: '#9fe8d8',
                    accentPrimary: '#00ffcc',
                    accentSecondary: '#00ff88',
                    accentDanger: '#ff8866',
                    borderColor: 'rgba(0, 255, 204, 0.2)'
                }
            }
        };
    }

    loadCurrentTheme() {
        const saved = localStorage.getItem('currentTheme');
        return saved || 'default';
    }

    saveCurrentTheme(themeId) {
        localStorage.setItem('currentTheme', themeId);
    }

    applyTheme(themeId) {
        const theme = this.themes[themeId];
        if (!theme) {
            console.error('Theme not found:', themeId);
            return;
        }

        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVarName, value);
        });

        // Apply special effects
        if (theme.special === 'animated-gradient') {
            document.body.classList.add('legendary-theme');
        } else {
            document.body.classList.remove('legendary-theme');
        }

        this.currentTheme = themeId;
        this.saveCurrentTheme(themeId);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { themeId, theme } }));
    }

    isThemeUnlocked(themeId, userLevel, userStats) {
        const theme = this.themes[themeId];
        if (!theme) return false;

        // Check level requirement
        if (userLevel < theme.levelRequired) return false;

        // Check special unlock conditions
        if (theme.unlockCondition) {
            switch (theme.unlockCondition) {
                case 'challenge_30_complete':
                    return userStats.challenge30Complete;
                case 'winrate_70':
                    return userStats.winRate >= 70;
                default:
                    return false;
            }
        }

        return true;
    }

    getAvailableThemes(userLevel, userStats) {
        return Object.entries(this.themes).map(([id, theme]) => ({
            ...theme,
            unlocked: this.isThemeUnlocked(id, userLevel, userStats)
        }));
    }

    selectTheme(themeId, userLevel, userStats) {
        if (!this.isThemeUnlocked(themeId, userLevel, userStats)) {
            alert('Este tema ainda está bloqueado!');
            return false;
        }

        this.applyTheme(themeId);
        return true;
    }
}

// ====================================================================
// UI PARA SELETOR DE TEMAS
// ====================================================================

function createThemeSelector(userLevel, userStats) {
    const themeSystem = new ThemeSystem();
    const themes = themeSystem.getAvailableThemes(userLevel, userStats);

    const container = document.createElement('div');
    container.className = 'theme-selector-modal';
    container.innerHTML = `
        <div class="theme-selector-content">
            <h2>🎨 Temas Visuais</h2>
            <p class="subtitle">Personalize sua experiência</p>
            
            <div class="themes-grid">
                ${themes.map(theme => `
                    <div class="theme-card ${theme.unlocked ? '' : 'locked'} ${theme.id === themeSystem.currentTheme ? 'active' : ''} rarity-${theme.rarity}"
                         onclick="selectThemeHandler('${theme.id}', ${userLevel}, ${JSON.stringify(userStats).replace(/"/g, '&quot;')})">
                        <div class="theme-preview" style="background: ${theme.preview}"></div>
                        <div class="theme-info">
                            <div class="theme-icon">${theme.icon}</div>
                            <div class="theme-name">${theme.name}</div>
                            <div class="theme-rarity rarity-${theme.rarity}">${theme.rarity.toUpperCase()}</div>
                            <div class="theme-description">${theme.description}</div>
                            ${!theme.unlocked ? `
                                <div class="theme-locked-info">
                                    🔒 Nível ${theme.levelRequired} ${theme.unlockCondition ? '+ ' + getUnlockConditionText(theme.unlockCondition) : ''}
                                </div>
                            ` : ''}
                            ${theme.id === themeSystem.currentTheme ? '<div class="theme-active-badge">✓ Ativo</div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="closeThemeSelector()" class="btn-close">Fechar</button>
        </div>
    `;

    document.body.appendChild(container);
}

function selectThemeHandler(themeId, userLevel, userStats) {
    const themeSystem = new ThemeSystem();
    if (themeSystem.selectTheme(themeId, userLevel, userStats)) {
        // Refresh UI
        closeThemeSelector();
        setTimeout(() => createThemeSelector(userLevel, userStats), 100);
    }
}

function closeThemeSelector() {
    document.querySelector('.theme-selector-modal')?.remove();
}

function getUnlockConditionText(condition) {
    const texts = {
        'challenge_30_complete': 'Desafio 30 Dias',
        'winrate_70': 'Win Rate 70%'
    };
    return texts[condition] || '';
}

// ====================================================================
// CSS PARA TEMA LENDÁRIO ANIMADO
// ====================================================================

const legendaryThemeStyle = `
    body.legendary-theme {
        background: linear-gradient(
            45deg,
            #0a0a14 0%,
            #1a0a24 25%,
            #0a1424 50%,
            #1a0a24 75%,
            #0a0a14 100%
        );
        background-size: 400% 400%;
        animation: legendaryGradient 10s ease infinite;
    }

    @keyframes legendaryGradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    body.legendary-theme::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.1), transparent 50%);
        pointer-events: none;
        z-index: -1;
    }
`;

// Inject legendary theme styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = legendaryThemeStyle;
    document.head.appendChild(style);

    // Track mouse for legendary theme effect
    document.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('legendary-theme')) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            document.body.style.setProperty('--mouse-x', x + '%');
            document.body.style.setProperty('--mouse-y', y + '%');
        }
    });
}

// ====================================================================
// EXPORT
// ====================================================================

if (typeof window !== 'undefined') {
    window.themeSystem = new ThemeSystem();
    window.createThemeSelector = createThemeSelector;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSystem;
}
