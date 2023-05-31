import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const AuthSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  password: { 
    type: String, 
    required: true 
}
});

AuthSchema.pre('save', async function (next) {
  if (this.isModified('hashedPassword')) {
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
  }
  next();
});

const Authentication = mongoose.model('Authentication', AuthSchema);

export default Authentication;

