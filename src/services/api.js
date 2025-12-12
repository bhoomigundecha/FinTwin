const API_BASE_URL = 'http://localhost:3000/api';

// Profile API
export const saveProfile = async (profile) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving profile:', error);
        throw error;
    }
};

// Transactions API
export const saveTransactions = async (transactions) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactions }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving transactions:', error);
        throw error;
    }
};

// Summary API
export const getSummary = async (range = 30) => {
    try {
        const response = await fetch(`${API_BASE_URL}/summary?range=${range}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching summary:', error);
        throw error;
    }
};

// Health Calculation API
export const calculateHealth = async (profile) => {
    try {
        const response = await fetch(`${API_BASE_URL}/calculateHealth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        return await response.json();
    } catch (error) {
        console.error('Error calculating health:', error);
        throw error;
    }
};

// Chat API
export const sendChatMessage = async (message, userProfile, context = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, userProfile, context }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

// Recommendations API
export const getRecommendations = async (intent, item, price) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/recommendations?intent=${intent}&item=${item}&price=${price}`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};
