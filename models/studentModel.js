let mongoose = require('../lib/mongoose');

let Schema = mongoose.Schema;
let studentScheme = new Schema({
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
    passedTests: {
        type: Array,
        required: true
    }
})

let StudentModel = mongoose.model("StudentModel", studentScheme);

module.exports = StudentModel;
