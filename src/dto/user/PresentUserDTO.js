
export default class PresentUserDTO {
    name;
    email;
    id;
    constructor(user){
        this.id = user._id;
        this.name = `${user.firstName} ${user.lastName}`;
        this.email = user.email;
    }
}