import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, // User sending the notification
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, // User receiving the notification
    type: {
        type: String,
        enum: ['like', 'comment', 'follow'],
        required: true,
    }, // Type of notification
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null,
    }, // Optional field for post notifications
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    }, // Optional field for comment notifications
},
{timestamps: true},
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;