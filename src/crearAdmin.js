import mongoose from 'mongoose';
import Administrador from './models/Administrador.js'; 

async function crearAdministrador() {
  try {
    await mongoose.connect('mongodb+srv://Lizzie:1234@cluster0.vchzz3b.mongodb.net/Zayenr');

    // Crea una instancia del modelo
    const admin = new Administrador({
      nombre: 'DIEGO MUSEO',
      email: 'diego.mullo@epn.edu.ec',
      rol: 'administrador'
    });
  
    // Cifra la contraseña usando el método del esquema
    admin.password = await admin.encrypPassword('12345');

    // Guarda en la base de datos
    await admin.save();

    console.log('Administrador creado exitosamente');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creando administrador:', error);
  }
}

crearAdministrador();
// Commit