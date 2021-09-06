let mongoose = require('../lib/mongoose');

let Schema = mongoose.Schema;
let testScheme = new Schema({
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
    questions: {
        type: Array,
        required: true
    },
    author: {
        type: Object,
        required: true
    },
    date: {
        type: Object,
        required: true
    },
    version: Array
})

let TestModel = mongoose.model("TestModel", testScheme);

module.exports = TestModel;
