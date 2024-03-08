const express= require('express');
const router = express.Router();
const Email = require('../models/email');

router.get('/', (req, res)=>{
    res.send('hello server');
})
 
router.post('/email/save', async(req, res)=>{
    try{
        const email = new Email({ ...req.body, Type: 'sent'});
        await email.save();
        res.send('email saved successfully!');
    }catch(err){
        res.status(500).send(err);
        console.log(err);
    }
})

router.post('/email/save-draft', async(req, res)=>{
    try{
        const id = req.body.id;
        if(id !== ''){
            //find email then  update it.
            const email = await Email.findByIdAndUpdate(id, req.body, {new: true});
            return res.json(email);
        }

        const email = new Email({...req.body, Type: 'draft'});
        await email.save();
        res.json(email);
    }catch(err){
        res.status(500).send(err);
        console.log(err);
    }
})

router.get('/email/starred/:id', async(req, res)=>{
    try{
        //toggle starred status of particular email
        const _id = req.params.id;
        const email = await Email.findById(_id);
        if(!email) res.status(404).send('email not found!');
    
        email.Starred = !email.Starred;
        await email.save();
        res.send('ok');
    }catch(err){
        res.status(500).send(err);
    }
})

router.get('/emails/:require/:pageNumber', async(req, res)=>{
    try{
        //email type will be inbox, sent, draft, starred, all mails, and bin.
        const requireType = req.params.require;
        const pageNo = parseInt(req.params.pageNumber) || 1;
        const itemsPerPage = 20;

        let query = {};
        let totalItems, totalPages;

        switch(requireType){
            case 'inbox':
            case 'sent':
            case 'draft': query = { Type: requireType, Bin: false }; break;
            case 'starred': query = { Starred: true, Bin: false }; break;
            case 'allMails': query = { Bin: false }; break;
            case 'bin': query = { Bin: true }; break;
            default : throw new Error('Invalid email type');
        }

        totalItems = await Email.countDocuments(query);
        totalPages = Math.ceil(totalItems / itemsPerPage);
        const emails = await Email.find(query).sort({ createdAt: -1 }).skip((pageNo - 1) * itemsPerPage).limit(itemsPerPage);

        res.json({ emails, totalPages });
    }catch(err){
        res.status(500).send(err);
    }
})

router.get('/search/:query/:pageNumber', async(req, res)=>{
    try{
        const query = req.params.query;
        const pageNo = parseInt(req.params.pageNumber);
        const itemsPerPage = 20;

        let keywords = query.split(' ');
        keywords = keywords.filter(keyword => keyword.trim() !== '');

        const regexQuery1 = keywords.map(keyword =>{
            return { Subject: { $regex: keyword, $options: 'i' }}
        })

        const regexQuery2 = keywords.map(keyword =>{
            return { Body: { $regex: keyword, $options: 'i' } }
        })

        const searchQuery = {
            Bin: false,
            $or: [ ...regexQuery1, ...regexQuery2 ]
        }
        
        const totalItems = await Email.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        const emails = await Email.find(searchQuery).sort({ createdAt: -1 }).skip((pageNo - 1) * itemsPerPage).limit(itemsPerPage);
        res.json({ emails, totalPages});
    }catch(err){
        res.status(500).send(err);
    }
})

router.get('/email/:id', async(req, res)=>{
    try{
        const _id = req.params.id;
        const email = await Email.findById(_id);
        if(!email) return res.status(404).send('email not found ');

        res.send(email);
    }catch(err){
        res.status(500).send(err);
    }
})

router.get('/email/toggleReadStatus/:id', async(req, res)=>{
    try{
        const _id = req.params.id;
        const email = await Email.findById(_id);
        if(!email) return res.status(404).send('email not found');

        email.MarkRead = !email.MarkRead;
        await email.save();
        res.send('ok');
    }catch(err){
        res.status.send(err);
    }
})

router.get('/delete/:id', async(req, res)=>{
    try{
        const _id = req.params.id;

        const email = await Email.findById(_id);
        if(!email) return res.status(404).send('email not found');

        if(!email.Bin){
            email.Bin = true;
            await email.save();
        }else{
            await Email.deleteOne({ _id });
        }
        res.send('email deleted successfully');
    }catch(err){
        res.status(500).send(err);
    }
}) 

router.post('/delete-Many/:type', async(req, res)=>{
    try{
        const { ids } = req.body;
        const type = req.params.type; //type will be bin or emails(inbox, sent, draft, all mail, starred)

        if(type === 'bin'){
            await Email.deleteMany({ _id: { $in: ids }});
        }else{
            const result = await Email.updateMany(
                { _id: { $in: ids}}, 
                { $set: { Bin: true }}, 
                {new: true});
            console.log(result);
        }
        res.send('email deleted successfully!');
    }catch(err){
        res.status(500).send(err);
    }
})

router.get('/restore-email/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        await Email.findByIdAndUpdate(id, {$set: {Bin: false}}, {new: true});
        res.send('ok');
    }catch(err){
        res.status(500).send(err);
        console.log(err);
    }
})

router.post('/restore-multiple-emails', async(req, res)=>{
    try{
        const { ids } = req.body;
        await Email.updateMany(
            { _id: {$in: ids }},
            { $set: { Bin: false}});
        
        res.send('emails restored successfully');
    }catch(err){
        res.status(500).send(err);
        console.log(err);
    }
})

module.exports = router;