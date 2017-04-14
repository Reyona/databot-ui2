/**
 * Created by ZENGJO on 3/17/2017.
 */


var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var issueRecordSchema=new Schema({
    "_id" : {type:Schema.ObjectId,unique:true},
    "name" : {type:String,unique:false},
    "L" : {type:String,unique:false},
    "R" : {type:String,unique:false},
    "key" : {type:String,unique:false},
    "data" : {type:String,unique:false},
    "data extraction from" : {type:String,unique:false},
    "data extraction to" : {type:String,unique:false},
    "execution time" : {type:String,unique:false},
    "ignore" : {type:Boolean,unique:false},
    "cleaned" : {type:Boolean,unique:false},
    "specFileName" : {type:String,unique:false},
    "isReprocess" : {type:Boolean,unique:false},
    "updatedAt" : {type:String,unique:false},
    "createdAt" : {type:String,unique:false},
    "logs" : {type:String,unique:false},
    "__v" : {type:Number,unique:false}
},{
    collection: 'probdatas'
});

mongoose.model('IssueRecord',issueRecordSchema);