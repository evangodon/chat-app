class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room, colour) {
        let user = {id, name, room, colour};
        this.users.push(user);
        return user;
    }

    removeUser (id){
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;

    }

    getUser (id){
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList (room) {
        return this.users.filter((user) => user.room === room);
    }
}

module.exports = {Users};