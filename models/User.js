const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    emailToken:{
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        default: 'active'
    },
    administrator:{
        type: Boolean,
        default: false
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});


//This function will be called before putting it into the database
//This function is meant to hash the password by using bcrypt to encrypt the password
UserSchema.pre('save', function(next) {
        const user = this; // Refers to the document that is about to be stored into the database
        if( this.password && this.isModified('password') )
        {
            const hash = bcrypt.hashSync(this.password, 10);//Takes the original text password and hashes it out to create an ecrypted form of the text
            this.password = hash;
        }
        
        next();// Move onto the next middleware in the sequence
    }
);

//This function is intended to compare the entered password when a user logs in and compare it to the stored one to see if they match
//If they don't match then the user will not be allowed into the website
UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;