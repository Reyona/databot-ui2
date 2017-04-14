/**
 * Created by CAOTE on 12/13/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema =new Schema({
    UserName:String,
    Password:String,
    Role:String,
    ReadOnly:Boolean,
    Date: String
},{
    collection: 'user'
});
mongoose.model('User', UserSchema);
