export default class UserDTOSearchMongo {
    _id;
    email;
    firstName;
    lastName;
    constructor(user) {
        this._id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
    }
}