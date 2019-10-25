const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ReferenceSchema = new Schema({
    text: {type: String, required: true},
    link: {type: String, required: true},
});


// Export the model
module.exports = mongoose.model('Reference', ReferenceSchema);