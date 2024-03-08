const mongoose = require('mongoose');

//later i will add attachments options 
const schema = new mongoose.Schema({
    To: {type: String, required: true},
    From: {type: String, required: true},
    Subject: {type: String},
    Body: {type: String},
    Type: {type: String, enum: ['inbox', 'sent', 'draft'], required: true},
    MarkRead: {type: Boolean, default: false},
    Starred: {type: Boolean, default: false},
    Bin: {type: Boolean, default: false}
}, {timestamps: true });

const Email = mongoose.model('Email', schema);
module.exports = Email;