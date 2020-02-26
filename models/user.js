const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    tasks: [{task: String, priorityLevel: Number, completed: Boolean}]
});
/* This will be called before user information is saved to the database.
   it will take the plain text password and hash it using bcrypt and store it.*/
UserSchema.pre('save', async function(next){
    const user = this; //'this refers to the current document about to be saved.

    const hash = await bcrypt.hash(user.password,10); /*The higher the salt rounds, the safer but the slower your application becomes*/
    user.password = hash;
    next(); //indicates we are done and moves on
});

UserSchema.methods.isValidPassword = async function(password){
    const user = this;

    //compare hash password sent by the user with the hashed passsword in the database
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const User = mongoose.model('User', UserSchema);
/*The first parameter is the  name you ant the model to bear. Mongoose automatically
looks for the plural, lowercased version of your model name. Eg 'User' would be 'users' */

module.exports = User;