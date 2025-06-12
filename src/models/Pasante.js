import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const pasanteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    facultad: {
        type: String,
        required: true,
        trim: true
    },
    celular: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: String,
        enum: ['pasante', 'administrador'],
        default: 'pasante'
    },
    token: {
        type: String,
        default: null
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Método para cifrar la contraseña
pasanteSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Método para verificar la contraseña
pasanteSchema.methods.matchPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Método para generar token
pasanteSchema.methods.crearToken = function () {
    const tokenGenerado = this.token = Math.random().toString(36).slice(2);
    return tokenGenerado;
};

export default model('Pasante', pasanteSchema);
