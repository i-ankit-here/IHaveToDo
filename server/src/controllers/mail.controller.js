import crypto from 'crypto';
import Invitation from '../models/Invitation.model.js';
import { sendInvitationEmail } from '../helpers/mail.helper.js';
import { Todo } from '../models/todo.models.js';
import { Conversation } from '../models/conversation.model.js';

/**
 * @desc    Create and send a new invitation
 * @route   POST /api/invites
 * @access  Private (requires authentication)
 */
export const createInvite = async (req, res) => {
  const { inviteeEmail,todoId,title,inviteeName } = req.body;
  console.log(inviteeEmail,todoId,title,inviteeName);
  // Assumes you have auth middleware that adds user to req object
  const inviterId = req.user.id; 

  if (!inviteeEmail || !todoId || !title || !inviteeName) {
    return res.status(400).json({ message: 'Invitee email, Todo ID, title, and invitee name are required.' });
  }

  try {
    // Check for an existing pending invitation for this email
    const existingInvite = await Invitation.findOne({ inviteeEmail, status: 'pending' });
    if (existingInvite) {
      return res.status(409).json({ message: 'An active invitation already exists for this email.' });
    }
    
    // Generate a unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration for 48 hours from now
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    // Send the invitation email
    await sendInvitationEmail(inviteeEmail, token, title, inviteeName, todoId);

    // Create a new invitation document
    const newInvite = new Invitation({
      inviter: inviterId,
      inviteeEmail,
      todoId,
      token,
      expiresAt,
    });

    await newInvite.save();
    

    res.status(201).json({ message: 'Invitation sent successfully.' });

  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * @desc    Verify an invitation token
 * @route   GET /api/invites/verify/:token
 * @access  Public
 */
export const verifyInvite = async (req, res) => {
  const { token, todoId } = req.params;
  console.log("Verifying invite with token:", token);
  console.log("Todo ID:", todoId);
  try {
    // Find the invitation by token that is still pending
    const invite = await Invitation.findOne({ token, status: 'pending' });

    if (!invite) {
      return res.status(404).json({ message: 'Invalid or expired invitation token.' });
    }

    let todoitem = await Todo.findById(todoId);
    if (!todoitem) {
      return res.status(404).json({ message: 'Todo item not found.' });
    }
    if(todoitem.team.includes(req.user._id)){
      return res.status(400).json({ message: 'You are already a member of this todo.' });
    }else{
      todoitem.team.push(req.user._id);
      todoitem = await todoitem.save();

      //Adding user to group Conversation
      const groupConversation = await Conversation.findOne({ $and : [{projectId: todoitem._id },{isGroupChat: true}] });
      groupConversation.participants.push(req.user._id);
      await groupConversation.save();

      for(let i=0;i<todoitem.team.length;i++){
        const id = todoitem.team[i];
        //Creating individual conversations
        const newConversation = await Conversation.create({
          projectId: todoitem._id,
          participants: [id,req.user._id],
          isGroupChat: false,
          groupName: "You",
        });
      }
    }
    invite.status = 'accepted'; // Optionally update the status
    const newInvite = await invite.save();
    res.status(200).json(todoitem);

  } catch (error) {
    console.error('Error verifying invitation:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};