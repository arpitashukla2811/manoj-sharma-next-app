import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for better query performance
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Middleware: Hash password before saving the user document 🔑
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance Method: Compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance Method: Generate default avatar if none is provided
userSchema.pre('save', function () {
  if (this.isNew && !this.avatar && this.name) {
    const formattedName = encodeURIComponent(this.name.trim() || 'User');
    this.avatar = `https://ui-avatars.com/api/?name=${formattedName}&background=random&color=fff`;
  }
});


// Instance Method: Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance Method: Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: Date.now() }
  });
};

// Static Method: Find user by email and check if locked
userSchema.statics.getAuthenticated = function(email, password) {
  return this.findOne({ email: email.toLowerCase() })
    .then(user => {
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.isLocked) {
        return user.incLoginAttempts().then(() => {
          throw new Error('Account is locked');
        });
      }
      
      return user.matchPassword(password).then(isMatch => {
        if (isMatch) {
          if (user.loginAttempts > 0) {
            return user.resetLoginAttempts().then(() => user);
          }
          return user;
        } else {
          return user.incLoginAttempts().then(() => {
            throw new Error('Invalid password');
          });
        }
      });
    });
};

export default mongoose.model('User', userSchema);