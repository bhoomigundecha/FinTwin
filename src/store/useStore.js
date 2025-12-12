import { create } from 'zustand';

const useStore = create((set) => ({
    // User profile
    userProfile: {
        userId: 'u123',
        monthlyIncome: 120000,
        monthlySavings: 20000,
        monthlyInvestments: 15000,
        goals: [
            {
                id: 'g1',
                name: 'New Phone',
                target: 70000,
                saved: 20000,
                priority: 2,
            },
        ],
        recurringExpenses: {
            rent: 25000,
            emi: 10000,
        },
    },
    setUserProfile: (profile) => set({ userProfile: profile }),

    // Financial health
    healthScore: 63,
    healthBreakdown: {
        savingRate: 0.3,
        investmentRate: 0.125,
        overspend: 0.05,
        goalProgress: 0.285,
        creditUtil: 0.2,
    },
    recommendations: [],
    setHealthData: (score, breakdown, recommendations) =>
        set({ healthScore: score, healthBreakdown: breakdown, recommendations }),

    // Avatar
    avatarUrl: 'https://models.readyplayer.me/693c9d7378f65986ccc82e8a.glb',
    setAvatarUrl: (url) => set({ avatarUrl: url }),

    // Chat
    chatHistory: [],
    addChatMessage: (message) =>
        set((state) => ({
            chatHistory: [...state.chatHistory, message],
        })),
    clearChat: () => set({ chatHistory: [] }),

    // Summary data
    summaryRange: 30,
    setSummaryRange: (range) => set({ summaryRange: range }),

    weeklySpending: [11000, 9000, 12000, 6000],
    categoryDistribution: {
        rent: 25000,
        emi: 10000,
        miscellaneous: 8000,
        grocery: 7000,
        travel: 12000,
    },
    goalCompletionPercentage: 63,
}));

export default useStore;
