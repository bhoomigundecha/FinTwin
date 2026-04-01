const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required:[true, 'Email is required for creating a user'],
        trim: true,
        lowercase: true,
        match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Please fill a valid email address'],
        unique: [true, 'Email already exists']
    },
    name: {
        type: String,
        required: [true, 'Name is required for creating a user']
    },
    password: {
        type: String,
        required: [true, 'Password is required for creating a user'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {