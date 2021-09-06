let mongoose = require('../lib/mongoose');

let Schema = mongoose.Schema;
let passedTestScheme = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    student: {
        type: Object,
        required: true
    },
    date: {
        type: Object,
        required: true
    },
    mark: {
        type: String,
        required: true
    },
    test: {
        type: String,
        required: true
    },
    version: Array
})

let PassedTestModel = mongoose.model("PassedTestModel", passedTestScheme);

module.exports = PassedTestModel;
