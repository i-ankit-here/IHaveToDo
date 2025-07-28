import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  inviteeEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending',
  },
  todoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // Automatically remove the document after it expires
    // The `expireAfterSeconds: 0` tells MongoDB to delete the doc 0 seconds after `expiresAt` time
    index: { expires: '0' },
  },
}, { timestamps: true });

// Ensure an invitee can only have one pending invitation at a time
invitationSchema.index({ inviteeEmail: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;