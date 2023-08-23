import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app.js';
import Tag from '../models/Tag.js';

dotenv.config({ path: './test.env' }); // path is relative to root directory of the project (same as package.json)
chai.use(chaiHttp);
const { expect } = chai;

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQxODI4ODZhYTY4YmQzNjQ3ODQzODMiLCJpYXQiOjE2OTI3NTA4NjYsImV4cCI6MTY5MzM1NTY2Nn0.bSekJunahfQAEZX6ssAQSOi3pmu0w-n4ewCzFR0CSlM';
const owner = '64d182886aa68bd364784383';

// API endpoint: /tags
describe('API endpoint: /tags', () => {
    const tagNames = [
        'home',
        'work',
        'business',
        'miscelaneous',
        'other',
        'culinary',
        'fruit',
        'toys',
        'electronics',
        'shopping',
        'health',
        'phone',
        'computers',
        'job',
        'programming',
    ];

    let tag = {
        name: '',
        owner,
    };

    let tagId = '';

    before(async () => {
        await mongoose.connect(process.env.DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await Tag.deleteMany({});
    });

    // Method: POST
    describe('POST', () => {
        // Add new tags
        it('should add new tags', async () => {
            for (let i = 0; i < tagNames.length; i++) {
                tag.name = tagNames[i];
                const res = await chai.request(app)
                    .post('/tags')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(tag);

                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name').eql(tag.name);
                expect(res.body).to.have.property('owner').eql(owner);
                expect(res.body.createdAt).to.be.an('string');
            }
        });

        it('should return error if tag already exists', async () => {
            const res = await chai.request(app)
                .post('/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Tag already exists.');
        });

        it('should return error if tag name is blank', async () => {
            tag.name = '';
            const res = await chai.request(app)
                .post('/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Tag name is required.');
        });

        it('should return error if owner ID is blank', async () => {
            tag.name = 'aaa';
            tag.owner = '';
            const res = await chai.request(app)
                .post('/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if owner ID is invalid', async () => {
            tag.owner = '0000';
            const res = await chai.request(app)
                .post('/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if owner ID does not exist', async () => {
            tag.owner = '000000000000000000000000';
            const res = await chai.request(app)
                .post('/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Owner not found.');
        });
    });

    // Method: GET
    describe('GET', () => {
        it('should retrieve 10 first tags - page 1, limit 10', async () => {
            const res = await chai.request(app)
                .get('/tags')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.eql(10);
            expect(res.body[0].name).to.be.eql(tagNames[0]);
            expect(res.body[1].name).to.be.eql(tagNames[1]);

            tagId = res.body[5]._id;
        });

        it('should retrieve 5 tags skipping two pages - page 3, limit 5', async () => {
            const res = await chai.request(app)
                .get('/tags?page=3&limit=5')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.eql(5);
            expect(res.body[0].name).to.be.eql(tagNames[10]);
            expect(res.body[1].name).to.be.eql(tagNames[11]);
        });

        it('should retrieve one tag by ID', async () => {
            const res = await chai.request(app)
                .get(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.be.eql(tagNames[5]);
        });

        it('should return error if tag ID is invalid', async () => {
            const id = '0000';
            const res = await chai.request(app)
                .get(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if tag ID does not exist', async () => {
            const id = '000000000000000000000000';
            const res = await chai.request(app)
                .get(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('ID not found.');
        });
    });

    // Method: PUT
    describe('PUT', () => {
        it('should update one tag by ID', async () => {
            tag.name = 'bbb';
            tag.owner = owner;
            const res = await chai.request(app)
                .put(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name').eql('bbb');
        });

        it('should return error if tag already exists', async () => {
            // eslint-disable-next-line prefer-destructuring
            tag.name = tagNames[0];
            const res = await chai.request(app)
                .put(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Tag already exists.');
        });

        it('should return error if tag name is blank', async () => {
            tag.name = '';
            const res = await chai.request(app)
                .put(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Tag name is required.');
        });

        it('should return error if owner ID is blank', async () => {
            tag.name = 'ccc';
            tag.owner = '';
            const res = await chai.request(app)
                .put(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if owner ID is invalid', async () => {
            tag.owner = '0000';
            const res = await chai.request(app)
                .put(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if owner ID does not exist', async () => {
            tag.owner = '000000000000000000000000';
            const res = await chai.request(app)
                .put(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Owner not found.');
        });

        it('should return error if tag ID is blank', async () => {
            tag.owner = owner;
            const id = '';
            const res = await chai.request(app)
                .put(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(404);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('Page not found.');
        });

        it('should return error if tag ID is invalid', async () => {
            tag.owner = owner;
            const id = '0000';
            const res = await chai.request(app)
                .put(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(400);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('One or more provided data are incorrect.');
        });

        it('should return error if tag ID does not exist', async () => {
            tag.owner = owner;
            const id = '000000000000000000000000';
            const res = await chai.request(app)
                .put(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(tag);

            expect(res).to.have.status(404);
            expect(res).to.be.an('object');
            expect(res.body).to.have.property('message').eql('ID not found.');
        });
    });

    // Method: DELETE
    describe('DELETE', () => {
        it('should delete one tag by ID', async () => {
            const res = await chai.request(app)
                .delete(`/tags/${tagId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include(`ID ${tagId} deleted successfuly.`);
        });

        it('should return error if tag ID is blank', async () => {
            const id = '';
            const res = await chai.request(app)
                .delete(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('Page not found.');
        });

        it('should return error if tag ID is invalid', async () => {
            const id = '0000';
            const res = await chai.request(app)
                .delete(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('One or more provided data are incorrect.');
        });

        it('should return error if tag ID does not exist', async () => {
            const id = '000000000000000000000000';
            const res = await chai.request(app)
                .delete(`/tags/${id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').to.include('ID not found.');
        });
    });
});

