export default class UserPrimaRepository {
    constructor(dao){
        this.dao = dao;
    }

    getUsers(){
        return this.dao.get();
    }

    getUserById(id){
        return this.dao.getOne({_id:id});
    }

    getUserByEmail(email){
        return this.dao.getOne({email:email})
    }

    createUser(user) {
        return this.dao.create(user);
    }
}