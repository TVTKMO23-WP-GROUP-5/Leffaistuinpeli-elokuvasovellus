let chai = require('chai')
let chaiHttp = require('chai-http') 
let server = require('../app')
chai.use(chaiHttp)

describe('POST /auth/register', async () => {
    it('checks all data', (done) => {
        chai.request(server)
            .post('/auth/register')
            .send({
                username: 'teuvo',
                email: 'teuvo@tepi.com',
                password: '123'
            })
            .then(function (res) {
                chai.expect(res).to.have.status(200);
                done()
            })
            .catch(function (err) {
                done(err);
            });
    })
})

describe('POST /auth/login', async () => {
    it('should return a token with correct details', (done) => {
        chai.request(server)
            .post('/auth/login')
            .send({
                username: 'tane',
                password: 'tane',
            })
            .then(function (res) {
                chai.expect(res).to.have.status(200);
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
                username: 'tane',
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
                password: 'tane',
            })
            .then(function (res) {
                chai.expect(res).to.have.status(404);
                done()
             })
            .catch(function (err) {
                done(err);
            });
    })
})

describe('GET /groups/allgroups', async () => {
    it('should get all groups', (done) => {
        chai.request(server)
            .get('/groups/allgroups')
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('array')
                done()
            })
    })
})

describe('POST /auth/delete', async () => {
    it('should delete user with right username', (done) => {
        chai.request(server)
            .delete('/auth/delete')
            .send({
                username: 'tane',
            })
            .end((err,res) =>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.have.property('message', 'User deleted successfully');
                done(err)
             })
        })
})