var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var rentSchema = new Schema({
	user : {
		type : ObjectId,
		ref : 'user',
		required : true
	},
	book : {
		type : ObjectId,
		ref : 'book',
		required : true
	},
	rent : {
		type : Date,
		default : Date.now,
		required : true
	},
	return : {
		type : Date
	}
}, {
    versionKey : false
});

module.exports = mongoose.model('rent', rentSchema);
