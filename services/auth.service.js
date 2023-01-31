const { randomUUID } = require('crypto');
const tokens = require('../databases/tokens');
const users = require('../databases/users');

class AuthService { 
    database;

    constructor(database) {
        this.database = database;
    }

    authUser(email,password) { 
       const user = users.find( user => user.email === email);

       if (!user) {
        throw new Error('Email is not registered');
    }

         if (password === user.password) {
            const uid = user.id;
            const userauth = this.database.find( userauth => userauth.id === uid);

            if ( userauth )
            { this.database.splice(this.database.indexOf(userauth), 1); }

            const token = randomUUID(); 
            this.database.push( { id: uid , token: token} );
            
           return token;
        }

      else {
        throw new Error('wrong password');
      }   

    }

    findUser(token) {
        const user = this.database.find( user => user.token === token );

        if (!user)
        { throw new Error('Token is not owned by any user'); }
             
        const userinfo = users.find( userinfo => userinfo.id === user.id )

        return userinfo;
    
    }

}

const authService = new AuthService(tokens);

module.exports = { authService };
