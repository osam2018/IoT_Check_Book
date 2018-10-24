var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var bookSchema = new Schema({
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

module.exports = mongoose.model('book', bookSchema);