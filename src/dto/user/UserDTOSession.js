export default class UserDTOSession {
    id;
    fullName;
    role;
    constructor(user) {
        id = user._id;
        fullName = `${user.firstName } ..`
        role = user.role;
    }
}