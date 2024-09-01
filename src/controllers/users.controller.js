// src/controllers/users.controller.js
//import MailingService from "../services/MailingService.js";
import { usersService } from '../services/repositories.js';
import PresentUserDTO from '../dto/user/PresentUserDTO.js';

const getUsers = async (req, res) => {
    const users = await usersService.getUsers();
    res.send({ status: 'success', payload: users });
};

const getUserById = async (req, res) => {
    res.send('GET By Id a users');
};

const createUser = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
        return res
            .status(400)
            .send({ status: 'error', error: 'Incomplete values' });
    }
    const newUser = {
        firstName,
        lastName,
        email,
    };
    const mailingService = new MailingService();
    const mailResult = mailingService.sendMail({
        from: 'Yo mismito <>',
        to: [email],
        html: `
        <div>
            <h1 style="color:yellow;">Hola, ${firstName}. Gracias por tu interés</h1>
            <p>Agradecería mucho que te tomes un tiempo para leer mi CV</p>
            <p>El cual encontrarás adjunto ;)</p>
            <p>Adicional, mi foto de CV puede variar a mi look actual, soy éste:</p>
            <img src="cid:perfil"/>
            <p>¡Espero podamos trabajar juntos pronto! Saludos.</p>
        </div>
        `,
        attachments: [
            {
                filename: 'perfile.jpg',
                path: './src/docs/perritoDeprimido.jpg',
                cid: 'perfil',
            },
            {
                filename: 'CV_actualizado.pdf', //Así le va a llegar en el correo,
                path: './src/docs/cv.pdf',
            },
        ],
    });
    const result = await usersService.createUser(newUser);
    res.status(201).send({ status: 'success', payload: result._id });
};

const updateUser = async (req, res) => {
    res.send('PUT O PATCH a users');
};

const deleteUser = async (req, res) => {
    res.send('DELETE a users');
};

// Ruta actualizada para devolver la información del usuario actual
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id; // Asegúrate de que req.user contiene el usuario autenticado
        const user = await usersService.getUserById(userId);

        if (!user) {
            return res
                .status(404)
                .send({ status: 'error', error: 'User not found' });
        }

        const userDTO = new PresentUserDTO(user);
        res.send({ status: 'success', payload: userDTO });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
};

export default {
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser,
    getCurrentUser,
};
