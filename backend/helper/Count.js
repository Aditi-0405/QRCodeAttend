const mongoose = require('mongoose');
const Count = require('../models/count');

async function getCurrentCount() {
    try {
        let countDoc = await Count.findOne();
        if (!countDoc) {
            countDoc = new Count({ studentCount: 0 });
            await countDoc.save();
        }
        return countDoc.studentCount;
    } catch (error) {
        console.error('Error retrieving count:', error);
        throw error;
    }
}

async function incrementCount() {
    try {
        let countDoc = await Count.findOne();
        if (!countDoc) {
            countDoc = new Count({ studentCount: 0 });
        }
        countDoc.studentCount += 1;
        await countDoc.save();
        return countDoc.studentCount;
    } catch (error) {
        console.error('Error incrementing count:', error);
        throw error;
    }
}

module.exports = { getCurrentCount , incrementCount};
