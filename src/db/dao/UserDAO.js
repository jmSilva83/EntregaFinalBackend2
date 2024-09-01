import usersModel from '../mongo/models/user.model.js';

class UsersDAO {
    getAll() {
        return usersModel.find({});
    }

    getById(userId) {
        return usersModel.findById(userId);
    }

    getByEmail(userEmail) {
        return usersModel.findOne({ email: userEmail });
    }

    create(user) {
        return usersModel.create(user);
    }

    update(id, user) {
        return usersModel.findByIdAndUpdate(id, { $set: user }, { new: true });
    }

    delete(id) {
        return usersModel.deleteOne({ _id: id });
    }
}

export default new UsersDAO();
