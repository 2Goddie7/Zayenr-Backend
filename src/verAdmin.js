import mongoose from 'mongoose';
import Administrador from './models/Administrador.js';

const main = async () => {
  await mongoose.connect('mongodb+srv://Lizzie:1234@cluster0.vchzz3b.mongodb.net/Zayenr');

  const admins = await Administrador.find();
  console.log(admins);

  await mongoose.disconnect();
};

main();