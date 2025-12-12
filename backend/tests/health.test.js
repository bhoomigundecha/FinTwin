const { calculateHealth } = require('../server');

describe('Health Calculation', () => {
    test('should calculate health score correctly for good financial profile', () => {
        const profile = {
            userId: 'test1',
            monthlyIncome: 120000,
            monthlySavings: 20000,
            monthlyInvestments: 15000,
            goals: [
                { id: 'g1', name: 'New Phone', target: 70000, saved: 20000, priority: 2 },
            ],
            recurringExpenses: {
                rent: 25000,
                emi: 10000,
            },
        };

        const result = calculateHealth(profile);

        expect(result).toHaveProperty('healthScore');
        expect(result).toHaveProperty('breakdown');
        expect(result).toHaveProperty('recommendations');
        expect(result.healthScore).toBeGreaterThanOrEqual(0);
        expect(result.healthScore).toBeLessThanOrEqual(100);
        expect(typeof result.healthScore).toBe('number');
    });

    test('should return consistent results for same input', () => {
        const profile = {
            userId: 'test2',
            monthlyIncome: 100000,
            monthlySavings: 15000,
            monthlyInvestments: 10000,
            goals: [],
            recurringExpenses: {
                rent: 20000,
                emi: 8000,
            },
        };

        const result1 = calculateHealth(profile);
        const result2 = calculateHealth(profile);

        expect(result1.healthScore).toBe(result2.healthScore);
    });

    test('should provide recommendations for low savings rate', () => {
        const profile = {
            userId: 'test3',
            monthlyIncome: 100000,
            monthlySavings: 5000, // Only 5% savings
            monthlyInvestments: 5000,
            goals: [],
            recurringExpenses: {
                rent: 30000,
            },
        };

        const result = calculateHealth(profile);

        expect(result.recommendations.length).toBeGreaterThan(0);
        expect(result.recommendations.some(r => r.includes('savings'))).toBe(true);
    });

    test('should handle overspending scenario', () => {
        const profile = {
            userId: 'test4',
            monthlyIncome: 50000,
            monthlySavings: 10000,
            monthlyInvestments: 5000,
            goals: [],
            recurringExpenses: {
                rent: 40000, // Total spending exceeds income
            },
        };

        const result = calculateHealth(profile);

        expect(result.breakdown.overspend).toBeGreaterThan(0);
        expect(result.recommendations.some(r => r.includes('expenses'))).toBe(true);
    });
});
