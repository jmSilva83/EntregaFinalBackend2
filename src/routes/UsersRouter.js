import usersController from '../controllers/users.controller.js';
import BaseRouter from './BaseRouter.js';
import { authRoles } from '../middlewares/authroles.js';
import UserDTOSession from '../dto/user/UserDTOSession.js';

class UsersRouter extends BaseRouter {
    init() {
        this.get('/users', ['ADMIN'], usersController.getUsers);
        this.get('/users/:id', ['ADMIN'], usersController.getUserById);
        this.post('/users', ['ADMIN'], usersController.createUser);
        this.put('/users/:id', ['ADMIN'], usersController.updateUser);
        this.delete('/users/:id', ['ADMIN'], usersController.deleteUser);
        this.get('/current', ['AUTHORIZED'], authRoles, (req, res) => {
            const userDTO = new UserDTOSession(req.user);
            res.json(userDTO);
        });
    }
}

const usersRouter = new UsersRouter();
export default usersRouter.getRouter();
