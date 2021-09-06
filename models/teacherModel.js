let mongoose = require('../lib/mongoose');

let Schema = mongoose.Schema;
let teacherScheme = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdTests: {
        type: Array,
        required: true
    }
})

let TeacherModel = mongoose.model("TeacherModel", teacherScheme);

module.exports = TeacherModel;
