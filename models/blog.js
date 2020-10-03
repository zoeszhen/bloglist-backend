const mongoose = require('mongoose');

const mongoUrl = 'mongodb+srv://admin:NIyiss9Tn098XyIl@cluster0.7xg2i.mongodb.net/phonebook?retryWrites=true&w=majority'

mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});


module.exports = mongoose.model('Blog', blogSchema);
