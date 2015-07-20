var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var Subjectschema = new Schema({
    course    : String,
    courseid : { type: Number, default: 0 },
    setion : String
},{ collection : 'subject' });

var Knowledgeschema = new Schema({
    haschildren    : Boolean,
    kid : Number,
    knowledge : String,
    parentid: Number,
    sujectid: Number
},{ collection : 'knowledge' });

var Resourceschema = new Schema({
    haschildren    : Boolean,
    rid : Number,
    resouce : String,
    parentid: Number,
    sujectid: Number
},{ collection : 'resource' });

var Questionschema = new Schema({
    answer    : String,
    question: String,
    questionid : String,
    questiontype : String,
    qtype: String,
    source: String,
    sujectid: Number,
    kid: String,
    difficult: String
},{ collection : 'question' });


mongoose.model( 'subject', Subjectschema );
mongoose.model( 'knowledge', Knowledgeschema );
mongoose.model( 'resource', Resourceschema );
mongoose.model( 'question', Questionschema );

var Rolesschema = new Schema({
    name: String,
    alias: String
},{ collection : 'roles' });

var Permissionschema = new Schema({
    name: String,
    roleid: Schema.Types.ObjectId,
    userid: Schema.Types.ObjectId,
    isstudent: Boolean,
    isteacher: Boolean,
    isadmin: Boolean,
    isschollmaster:Boolean
},{ collection : 'permission' });

var Accountschema = new Schema({
    username: String,
    email: String,
    phone: String,
    realname: String,
    password: String,
    title: { type: String, default: "" },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
    alies: { type: String, default: "" },
    isstudent: { type: Boolean, default: true },
    isteacher: { type: Boolean, default: false },
    isadmin: { type: Boolean, default: false },
    isdirector:{ type: Boolean, default: false }
},{ collection : 'account' });

var Studentschema = new Schema({
    grade: String,
    class: String,
    schoolid: {type: String ,default: ""},
    school: { type: String, default: "" },
    student_number: String,
    accountid:{type: String ,default: ""}
},{ collection : 'student' });

var Teacherschema = new Schema({
    grade: String,
    class: String,
    schoolid: {type: String ,default: ""},
    school: { type: String, default: "" },
    courseid: {type: String ,default: ""},
    course:{ type: String, default: "" },
    accountid: {type: String ,default: ""}
},{ collection : 'teacher' });

var Schoolschema = new Schema({
    name: String,
    region: { type: String, default: "" }
},{ collection : 'school' });


var Sessionschema = new Schema({
    sessionkey: String,
    logintime: { type: Date, default: Date.now },
    overdue: { type: Date, default: Date.now },
    isactive: Boolean
},{ collection : 'session' });


mongoose.model( 'roles', Rolesschema );
mongoose.model( 'permission', Permissionschema );
mongoose.model( 'account', Accountschema );
mongoose.model( 'student', Studentschema );
mongoose.model( 'teacher', Teacherschema );
mongoose.model( 'session', Sessionschema );
mongoose.model( 'school', Schoolschema );