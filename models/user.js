var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    name: {type: String, default: ''},
    email   : {type: String, default: ''},
    password: {type: String},                // we are not adding required because when the user login through facebook we don't store password in the DB 
    image: {type: String, default: ''},
    dob: {type: String, default: ''},
    gender: {type: String, default: ''},
    city: {type: String, default: ''},
    phone: {type: String, default: ''},
    interest: {type: String, default: ''},
    journey: {type: String, default: ''},
    expectation: {type: String, default: ''},
    
    

    community: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    
    myCommunity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],

    pendingCommunity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],

    inviteCommunity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],

/*
    community: [{
        communityId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''},
        memberCount: {type: Number, default: 0}
    }],
    
    myCommunity: [{
        myCommunityId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''},
        requestCount: {type: Number, default: 0}
    }],

    pendingCommunity: [{
        pendingCommunityId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''},
        memberCount: {type: Number, default: 0}
    }],

    inviteCommunity: [{
        inviteCommunityId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''},
        memberCount: {type: Number, default: 0}
    }],*/
    
    activated: {type: String, default: ''},
    role: {type: String, default: ''},
    status: {type: String, default: ''},
});

userSchema.methods.encryptPassword = (password) => {
     return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.validPassword   = function(password){    
     return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);