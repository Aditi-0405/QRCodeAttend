const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

adminSchema.pre('save', async function(){
    const salt= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password, salt)
})

adminSchema.methods.comparePassword = async function (userPassword){

    const isMatch= await bcrypt.compare(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('Admin', adminSchema);
