import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new Schema({
    fullName: {
        type: 'String',
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be alteast 5 character'],
        maxLength: [50, 'Name should be less than 20 characters'],
        lowercase: true,
        trim: true
    },
    email: {
        type: 'String',
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'please fill in a valid email address']
    },
    password: {
        type: 'String',
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be more than 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: 'String'
        },
        secure_url: {
            type: 'String'
        }
    },
    role: {
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status: String,
    }
},
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    generateJWTToken: async function () {
        return await jwt.sign({
            id: this._id, email: this.email, subscription: this.subscription, role: this.role
        },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            })
    },
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password)
    },
    generatePasswordResetToken: async function () {
        const resetToken = crypto.randomBytes(20).toString('hex')

        this.forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')
            ;
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15min from now

        return
    }
}

const User = mongoose.model("User", userSchema);
export default User