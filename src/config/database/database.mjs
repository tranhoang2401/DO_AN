import dotenv from 'dotenv';
dotenv.config();
import { connect } from 'mongoose';

async function connectDB() {
  try {
    connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@smartdoor.crkdd4i.mongodb.net/smartdoor?retryWrites=true&w=majority&appName=SmartDoor`);
    console.log('Connect sucessfully');
  } catch (error) {
    console.log('Connect failure' + error);
  }
}

export default connectDB;
