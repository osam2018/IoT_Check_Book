var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
    number : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    }
}, {
    versionKey : false
});

module.exports = mongoose.model('user', userSchema);