import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  UserName: String,
  Name: String,
  Nationality: String,
  Comp_Name: String,
  Date_establishment: String,
  AgentID: String,
  CreatedDate: Date,
  LastLogin: Date
}, { collection: 'agents' });

export default mongoose.model('Agent', agentSchema);
