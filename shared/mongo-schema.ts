import mongoose, { Schema, type Document } from "mongoose";

// === USER SCHEMA ===
export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MongoUser = mongoose.model<IUser>("User", UserSchema);

// === QUEUE ENTRY SCHEMA ===
export interface IQueueEntry extends Document {
  name: string;
  phoneNumber: string;
  numberOfPeople: number;
  queueNumber: number;
  status: 'waiting' | 'called' | 'confirmed' | 'expired' | 'cancelled' | 'completed';
  notificationSent: boolean;
  notificationSentAt?: Date;
  notificationStatus: 'pending' | 'sent' | 'failed';
  calledAt?: Date;
  responseDeadline?: Date;
  respondedAt?: Date;
  responseType?: 'accepted' | 'cancelled' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const QueueEntrySchema: Schema = new Schema({
  name: { type: String, default: "Guest" },
  phoneNumber: { type: String, required: true },
  numberOfPeople: { type: Number, required: true },
  queueNumber: { type: Number, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['waiting', 'called', 'confirmed', 'expired', 'cancelled', 'completed'],
    default: 'waiting',
    required: true 
  },
  notificationSent: { type: Boolean, default: false },
  notificationSentAt: { type: Date },
  notificationStatus: { 
    type: String, 
    enum: ['pending', 'sent', 'failed'],
    default: 'pending' 
  },
  calledAt: { type: Date },
  responseDeadline: { type: Date },
  respondedAt: { type: Date },
  responseType: { 
    type: String, 
    enum: ['accepted', 'cancelled', 'expired'] 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const MongoQueueEntry = mongoose.model<IQueueEntry>("QueueEntry", QueueEntrySchema);

// === NOTIFICATION SCHEMA ===
export interface INotification extends Document {
  queueId: mongoose.Types.ObjectId;
  phoneNumber: string;
  message: string;
  type: 'sms' | 'call';
  status: 'sent' | 'failed' | 'pending';
  twilioSid?: string;
  error?: string;
  sentAt?: Date;
}

const NotificationSchema: Schema = new Schema({
  queueId: { type: Schema.Types.ObjectId, ref: 'QueueEntry' },
  phoneNumber: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['sms', 'call'], default: 'sms' },
  status: { type: String, enum: ['sent', 'failed', 'pending'], required: true },
  twilioSid: { type: String },
  error: { type: String },
  sentAt: { type: Date },
});

export const MongoNotification = mongoose.model<INotification>("Notification", NotificationSchema);
