const mongoose = require('mongoose');
const userModel = require('../models/user.model');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const users = await userModel.find({});
        console.log('--- ALL USERS ---');
        users.forEach(u => console.log(`Username: ${u.username}, Email: ${u.email}, Role: ${u.role}`));
        console.log('-----------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
