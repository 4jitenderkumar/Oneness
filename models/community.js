
var mongoose = require('mongoose');

var communitySchema = mongoose.Schema({
    name: {type: String, default: ''}, 
    description: {type: String, default: ''},
    rule: {type: String, default: ''},
    image: {type: String, default: ''},
    date: {type: String, default: ''},
    activated: {type: String, default: 'yes'},

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    invitedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    request: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]


    
  /*  owner: {
        ownerId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    },
    admin: [{
        adminId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    }],
    user: [{
        userId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    }],
    invitedUser: [{
        invitedUserId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    }],
    request: [{
        requestId: {type: String, default: ''},
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    }]*/
}); 

module.exports = mongoose.model('Community', communitySchema);
