// TODO: Create auth service that will do the following:
// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.
// 2. Create a method that will take in a token and return the user's who owns the token.

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

            if ( userauth ) //user has a token 
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