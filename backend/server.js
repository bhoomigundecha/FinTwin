const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (mock database)
let userProfiles = {};
let transactions = [];

// Health calculation function
function calculateHealth(profile) {
    const {
        monthlyIncome,
        monthlySavings,
        monthlyInvestments,
        goals,
        recurringExpenses,
    } = profile;

    // Calculate metrics
    const savingRate = monthlySavings / monthlyIncome;
    const investmentRate = monthlyInvestments / monthlyIncome;

    const totalExpenses = Object.values(recurringExpenses).reduce((a, b) => a + b, 0);
    const totalSpending = totalExpenses + monthlySavings + monthlyInvestments;
    const overspend = Math.max(0, (totalSpending - monthlyIncome) / monthlyIncome);

    // Calculate goal progress (average across all goals)
    const goalProgress = goals.length > 0
        ? goals.reduce((sum, goal) => sum + (goal.saved / goal.target), 0) / goals.length
        : 0;

    // Mock credit utilization (would come from actual credit data)
    const creditUtil = 0.2;

    // Weighted health score calculation
    const weights = {
        savingRate: 0.30,
        investmentRate: 0.25,
        overspend: -0.20,
        goalProgress: 0.15,
        creditUtil: 0.10,
    };

    let healthScore = 0;
    healthScore += savingRate * weights.savingRate * 100;
    healthScore += investmentRate * weights.investmentRate * 100;
    healthScore += overspend * weights.overspend * 100;
    healthScore += goalProgress * weights.goalProgress * 100;
    healthScore += (1 - creditUtil) * weights.creditUtil * 100;

    // Clamp between 0 and 100
    healthScore = Math.max(0, Math.min(100, healthScore));

    // Generate recommendations
    const recommendations = [];
    if (savingRate < 0.2) recommendations.push('Increase your monthly savings to at least 20% of income');
    if (investmentRate < 0.1) recommendations.push('Consider investing at least 10% of your income');
    if (overspend > 0) recommendations.push('Reduce expenses to stay within your income');
    if (goalProgress < 0.5) recommendations.push('Focus on achieving your financial goals');

    return {
        healthScore: Math.round(healthScore),
        breakdown: {
            savingRate,
            investmentRate,
            overspend,
            goalProgress,
            creditUtil,
        },
        recommendations,
    };
}

// Routes

// POST /api/profile - Save user profile
app.post('/api/profile', (req, res) => {
    try {
        const profile = req.body;
        userProfiles[profile.userId] = profile;
        res.json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/transactions - Add transactions
app.post('/api/transactions', (req, res) => {
    try {
        const newTransactions = req.body.transactions;
        transactions.push(...newTransactions);

        // Aggregate by category
        const aggregated = {};
        transactions.forEach(t => {
            aggregated[t.category] = (aggregated[t.category] || 0) + t.amount;
        });

        res.json({ success: true, aggregated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/summary - Get summary data
app.get('/api/summary', (req, res) => {
    try {
        const range = parseInt(req.query.range) || 30;

        // Mock weekly spending data
        const weeklySpending = [11000, 9000, 12000, 6000];

        // Mock category distribution
        const categoryDistribution = {
            rent: 25000,
            emi: 10000,
            miscellaneous: 8000,
            grocery: 7000,
            travel: 12000,
        };

        // Mock goal status
        const goalStatus = {
            completed: 63,
            inProgress: 2,
            total: 3,
        };

        res.json({
            range,
            weeklySpending,
            categoryDistribution,
            goalStatus,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/calculateHealth - Calculate financial health
app.post('/api/calculateHealth', (req, res) => {
    try {
        const profile = req.body;
        const healthData = calculateHealth(profile);
        res.json(healthData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/chat - Chat endpoint
app.post('/api/chat', (req, res) => {
    try {
        const { message, userProfile, context } = req.body;

        // Simple rule-based responses
        let reply = "I'm here to help you with your financial decisions!";
        const suggestions = [];
        const actions = [];

        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
            reply = 'Maybe you switch to a cheaper alternative';
            suggestions.push('Consider waiting a few months');
            suggestions.push('Look for deals or discounts');
            actions.push('view_recommendations');
        } else if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
            reply = 'Great! Saving is important for your financial health.';
            suggestions.push('Set up automatic transfers');
            suggestions.push('Track your progress regularly');
        } else if (lowerMessage.includes('invest')) {
            reply = 'Investing is a smart way to grow your wealth!';
            suggestions.push('Diversify your portfolio');
            suggestions.push('Consider long-term investments');
        }

        res.json({ reply, suggestions, actions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/recommendations - Get purchase recommendations
app.get('/api/recommendations', (req, res) => {
    try {
        const { intent, item, price } = req.query;

        if (intent === 'buy_item') {
            const priceNum = parseInt(price);

            const recommendation = {
                item,
                price: priceNum,
                pros: [
                    'No need to buy again for next 4 years',
                    'You will get a premium resale value',
                ],
                cons: [
                    "Your usse is basic, don't need to spend so much",
                    'Goal completion will get delayed by 21 days',
                ],
                overall: 'If you continue to invest and save according to our plan, you will be able to comfortably buy it after 4 months.',
                affordableIn: 4, // months
                impact: {
                    healthScoreChange: -5,
                    goalDelayDays: 21,
                },
            };

            res.json(recommendation);
        } else {
            res.json({ error: 'Unknown intent' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Financial Twin API running on http://localhost:${PORT}`);
});

module.exports = { app, calculateHealth };
