import mongoose from 'mongoose';

const agentProfileSchema = new mongoose.Schema({
  ProfileID: String,
  UserName: String,
  AgentID: String,
  Phone: String,
  Status: String,
  Tier: String,
  Region: String,
  CommissionRate: Number,
  TotalBookings: Number,
  Rating: Number,
  IsVerified: Boolean,
  ProfileCreatedDate: Date,
  LastUpdatedDate: Date
}, { collection: 'agent_profiles' });

export default mongoose.model('AgentProfile', agentProfileSchema);
