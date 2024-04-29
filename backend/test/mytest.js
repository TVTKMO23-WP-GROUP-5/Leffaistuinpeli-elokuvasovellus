const {
    getGroupId, 
} = require('../database/groupmembers_db')

let chai = require('chai')
let chaiHttp = require('chai-http') 
let server = require('../app')
chai.use(chaiHttp)

describe('POST /auth/register', async () => {
    it('Checks if register is fine', (done) => {
        chai.request(server)
            .post('/auth/register')
            .send({
                fname: 'petteri',
                lname: 'kuusisto',
                username: 'petteri',
                email: 'peter@tepi.com',
                password: '12345678'
            })
            .then(function (res) {
                chai.expect(res).to.have.status(201);
                chai.expect(res.body).to.have.property('fname');
                chai.expect(res.body).to.have.property('lname');
                chai.expect(res.body).to.have.property('username');
                chai.expect(res.body).to.have.property('email');
                chai.expect(res.body).to.have.property('message', 'success')
                chai.expect(res.body.fname).to.be.a('string');
                chai.expect(res.body.lname).to.be.a('string');
                chai.expect(res.body.username).to.be.a('string');
                chai.expect(res.body.email).to.be.a('string');
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
    it('Should fail if fname is empty', (done) => {
        chai.request(server)
            .post('/auth/register')
            .send({
                fname: '',
                lname: 'kuusisto',
                username: 'petteri',
                email: 'peter@tepi.com',
                password: '12345678'
            })
            .then(function (res) {
                chai.expect(res).to.have.status(403);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
    it('Should fail if lname is empty', (done) => {
        chai.request(server)
            .post('/auth/register')
            .send({
                fname: 'petteri',
                lname: '',
                username: 'petteri',
                email: 'peter@tepi.com',
                password: '12345678'
            })
            .then(function (res) {
                chai.expect(res).to.have.status(403);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
    it('Should fail if username is empty', (done) => {
        chai.request(server)
            .post('/auth/register')
            .send({
                fname: 'petteri',
                lname: 'kuusisto',
                username: '',
                email: 'peter@tepi.com',
                password: '12345678'
            })
            .then(function (res) {
                chai.expect(res).to.have.status(403);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
    it('Should fail if email is empty', (done) => {
        chai.request(server)
            .post('/auth/register')
            .send({
                fname: 'petteri',
                lname: 'kuusisto',
                username: 'petteri',
                email: '',
                password: '12345678'
            })
            .then(function (res) {
                chai.expect(res).to.have.status(403);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
    it('Should fail if passwors is less than eigth characters', (done) => {
        chai.request(server)
            .post('/auth/register')
            .send({
                fname: 'petteri',
                lname: 'kuusisto',
                username: 'petteri',
                email: 'peter@tepi.com',
                password: '1234'
            })
            .then(function (res) {
                chai.expect(res).to.have.status(403);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
})

describe('GET /account', async () => {
    it('should return the account with the provided username', (done) => {
        const username = 'petteri';
        chai.request(server)
            .get('/account')
            .query({ username })
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('username').equal(username);
                done();
            });
    });

    it('should return 404 if account with the provided username does not exist', (done) => {
        const nonExistingUsername = 'hömppäpömppä';
        chai.request(server)
            .get('/account')
            .query({ nonExistingUsername })
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                done();
            });
    });
});

describe('POST /auth/login', async () => {
    it('should return a token with correct details', (done) => {
        chai.request(server)
            .post('/auth/login')
            .send({
                username: 'petteri',
                password: '12345678',
            })
            .then(function (res) {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.have.property('jwtToken')
                done()
             })
            .catch(function (err) {
                done(err);
            });
    })

    it('should fail with wrong password', (done) => {
        chai.request(server)
            .post('/auth/login')
            .send({
                username: 'petteri',
                password: 'väärin',
            })
            .then(function (res) {
                chai.expect(res).to.have.status(401);
                done()
             })
            .catch(function (err) {
                done(err);
            });
    })

    it('should fail with wrong username', (done) => {
        chai.request(server)
            .post('/auth/login')
            .send({
                username: 'väärä',
                password: '12345678',
            })
            .then(function (res) {
                chai.expect(res).to.have.status(404);
                done()
             })
            .catch(function (err) {
                done(err);
            });
    })

    it('should respond with error if username is empty', (done) => {
        chai.request(server)
            .post('/auth/login')
            .send({
                username: '',
                password: '12345678',
            })
            .then(function (res) {
                chai.expect(res).to.have.status(400)
                done()
             })
            .catch(function (err) {
                done(err);
            });
    })

    it('should respond with error if password is empty', (done) => {
        chai.request(server)
            .post('/auth/login')
            .send({
                username: 'petteri',
                password: '',
            })
            .then(function (res) {
                chai.expect(res).to.have.status(400)
                done()
             })
            .catch(function (err) {
                done(err);
            });
    })
})

describe('GET /groups/   ', async () => {
    it('should get all groups, /groups/allgroups', (done) => {
        chai.request(server)
            .get('/groups/allgroups')
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('array')
                done()
            })
    })
    it('should get own groups, /groups/owngroups', (done) => {
        const username = 'petteri';
        chai.request(server)
            .get('/groups/owngroups')
            .query({ username })
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('array')
                done()
            })
    })
    it('no username when getting owngroups, /groups/owngroups', (done) => {
        const username = '';
        chai.request(server)
            .get('/groups/owngroups')
            .query({ username })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body).to.have.property('msg').equal("Username is required" );
                done()
            })
    })
    it('Should return status 201 when registering group, /groups/register', (done) => {
        chai.request(server)
            .post('/groups/register')
            .send({
                groupname: "testiryhmä",
                description: "Tämä testaa vain, voisiko perustaa ryhmän",
                owner: "petteri"
            })
            .then(function (res) {
                chai.expect(res).to.have.status(201);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
    it('Should return error if no username in groupregister, /groups/register', (done) => {
        chai.request(server)
            .post('/groups/register')
            .send({
                groupname: "testiryhmä",
                description: "Tämä testaa vain, voisiko perustaa ryhmän",
                owner: ""
            })
            .then(function (res) {
                chai.expect(res).to.have.status(400);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
})

describe('POST /getmembers/deletegroup', async () => {
    it('should delete group /getmembers/deletegroup', async () => {
        let id;
        const groupID = await getGroupId('petteri');
        await Promise.all(groupID.map(async (group) => {
            if (group.groupname === "testiryhmä") {
                id = group.idgroup;
            }
        }));
    
        if (!id) {
            throw new Error("Test group not found");
        }
    
        try {
            const res = await chai.request(server)
                .post('/getmembers/deletegroup')
                .send({
                    owner: "petteri",
                    ID: id
                });
            chai.expect(res).to.have.status(200);
        } catch (err) {
            throw err;
        }
    });
})

describe('DELETE /auth/delete', async () => {
    it('should delete user with right username', async () => { 
        return chai.request(server) 
            .delete('/auth/delete')
            .send({
                username: 'petteri',
            })
            .then((res) => { 
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.have.property('message', 'All user data deleted successfully')
            })
            .catch((err) => { 
                throw err
            })
    })

    it('should return a 404 error for non-existing user', async () => {
        return chai.request(server)
            .delete('/auth/delete')
            .send({
                username: 'nonexistentuser',
            })
            .then((res) => {
                chai.expect(res).to.have.status(404);
                chai.expect(res.body).to.have.property('error', 'User not found');
            })
            .catch((err) => {
                throw err;
            });
    });
})