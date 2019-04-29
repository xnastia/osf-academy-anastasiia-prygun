// require the needed modules
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

/** With mongoose, everything is derived from the schema.
 We have a Schema below with email, password, profile, address, history properties */
const UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    facebook: String,
    tokens: Array,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    profile: {
        name: {type: String, default: ''},
        picture: {type: String, default: ''}
    },
    address: String,
    currency: {type: String, required: true, default: 'USD'},
    history: [{
        paid: {type: Number, default: 0},
        item: {type: Schema.Types.ObjectId, ref: 'Product'}
    }],
    wishes: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

/** Hash the password before saving it to the database*/
UserSchema.pre('save', function(next) {
    /** this refers to the user passed as argument to the save method in /routes/user*/
    const user = this;
    /** only hash the password if it has been modified or its new */
    if (!user.isModified('password')) return next();
    // generate the salt
    bcrypt.genSalt(10, function(err, salt) {
        /** hash the password using the generated salt */
        bcrypt.hash(user.password, salt, function(err, hash) {
            /** if an error has occured we stop hashing */
            if (err) return next(err);
            /** override the cleartext (user entered) passsword with the hashed one */
            user.password = hash;
            /** return a callback */
            next();
        });
    });
});

/** compare database password with user user entered password */
UserSchema.methods.comparePassword = function(userPassword) {
    /** this.password refers to the database password,
     userPassword to the password the user entered on the login form*/
    return bcrypt.compareSync(userPassword, this.password);
};
/** compiling our schema into a model object - a class that constructs documents in mongoose */
module.exports = mongoose.model('User', UserSchema);