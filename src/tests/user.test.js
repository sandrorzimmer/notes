import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';

dotenv.config({ path: './test.env' }); // path is relative to root directory of the project (same as package.json)
chai.use(chaiHttp);
const { expect } = chai;

let authToken = '';
let userId = '';
let user = {
    name: '',
    username: '',
    password: '',
};

const usernames = [
    'john',
    'paul',
    'richard',
    'walter',
    'berta',
    'carl',
    'jason',
    'bruce',
    'robert',
    'charles',
    'alan',
    'william',
    'elizabeth',
    'george',
    'samantha',
];

describe('-->>> USERS - - Create new user and authenticate', () => {
    before(async () => {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        await User.deleteMany({});
    });

    describe('Create new user', () => {
        it('should create a new user', async () => {
            const userOne = {
                name: 'New User',
                username: 'newUser',
                password: '123456789Aa',
            };
            const res = await chai.request(app)
                .post('/users')
                .send(userOne);

            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('username').eql(userOne.username);
            expect(res.body).to.have.property('password');
        });
    });

    describe('Generate authToken', () => {
        it('should create a new token', async () => {
            const userOne = {
                username: 'newUser',
                password: '123456789Aa',
            };
            const res = await chai.request(app)
                .post('/login')
                .send(userOne);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');

            authToken = res.body.token;
        });
    });
});

describe('- API endpoint: /users', () => {
    describe('POST', () => {
        it('should add new users', async () => {
            for (let i = 0; i < usernames.length; i++) {
                user.name = usernames[i];
                user.username = usernames[i];
                user.password = '123456789Aa';
                const res = await chai.request(app)
                    .post('/users')
                    .send(user);

                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('username').eql(user.username);
                expect(res.body).to.have.property('password');
            }
        });

        it('should return error if username already exists', async () => {
            const res = await chai.request(app)
                .post('/users')
                .send(user);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('This username is already used.');
        });

        it('should return error if username is blank', async () => {
            user.username = '';
            const res = await chai.request(app)
                .post('/users')
                .send(user);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('A username is required.');
        });

        it('should return error if password is blank', async () => {
            user.username = 'aaa';
            user.password = '';
            const res = await chai.request(app)
                .post('/users')
                .send(user);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('A password is required.');
        });

        it('should return error if password is shorter than 8 characters', async () => {
            user.username = 'aaa';
            user.password = '123Aa';
            const res = await chai.request(app)
                .post('/users')
                .send(user);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Password is not valid');
        });

        it('should return error if password does not contain lower case', async () => {
            user.username = 'aaa';
            user.password = '123456789A';
            const res = await chai.request(app)
                .post('/users')
                .send(user);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Password is not valid');
        });

        it('should return error if password does not contain upper case', async () => {
            user.username = 'aaa';
            user.password = '123456789a';
            const res = await chai.request(app)
                .post('/users')
                .send(user);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Password is not valid');
        });
    });

    // Method: GET
    describe('GET', () => {
        it('should retrieve 10 first users - page 1, limit 10', async () => {
            const res = await chai.request(app)
                .get('/users')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.eql(10);
            expect(res.body[1].name).to.be.eql(usernames[0]);
            expect(res.body[2].name).to.be.eql(usernames[1]);

            userId = res.body[1]._id;
        });

        it('should retrieve one user by ID', async () => {
            const res = await chai.request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.username).to.be.eql(usernames[0]);
        });

        it('should return error if user ID is invalid', async () => {
            const id = '0000';
            const res = await chai.request(app)
                .get(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if user ID does not exist', async () => {
            const id = '000000000000000000000000';
            const res = await chai.request(app)
                .get(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('ID not found.');
        });
    });

    // Method: PUT
    describe('PUT', () => {
        it('should update one user by ID', async () => {
            user.name = 'bbb';
            user.username = 'ccc';
            user.password = '987654321Aa';
            const res = await chai.request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(user);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name').eql(user.name);
            expect(res.body).to.have.property('username').eql(user.username);
        });

        it('should return error if username already exists', async () => {
            // eslint-disable-next-line prefer-destructuring
            user.username = 'newUser';
            const res = await chai.request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(user);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('This username is already used.');
        });

        it('should return error if username is blank', async () => {
            user.username = '';
            const res = await chai.request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(user);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Username is required');
        });

        it('should return error if user ID is blank', async () => {
            const id = '';
            const res = await chai.request(app)
                .put(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(user);

            expect(res).to.have.status(404);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Page not found.');
        });

        it('should return error if user ID is invalid', async () => {
            const id = '0000';
            user.username = 'eee';
            const res = await chai.request(app)
                .put(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(user);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if user ID does not exist', async () => {
            const id = '000000000000000000000000';
            const res = await chai.request(app)
                .put(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(user);

            expect(res).to.have.status(404);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('ID not found.');
        });
    });
    // Method: DELETE
    describe('DELETE', () => {
        it('should delete one user by ID', async () => {
            const res = await chai.request(app)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include(`ID ${userId} deleted successfully`);
        });

        it('should return error if user ID is blank', async () => {
            const id = '';
            const res = await chai.request(app)
                .delete(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Page not found.');
        });

        it('should return error if tag ID is invalid', async () => {
            const id = '0000';
            const res = await chai.request(app)
                .delete(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('One or more provided data are incorrect.');
        });

        it('should return error if user ID does not exist', async () => {
            const id = '000000000000000000000000';
            const res = await chai.request(app)
                .delete(`/users/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('ID not found.');
        });
    });
});

