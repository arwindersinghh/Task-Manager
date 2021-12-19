const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/User')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Mike",
    email: "mike@example.com",
    password: "56What!!!",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async() => {
     await User.deleteMany()
     await new User(userOne).save()
})

// afterEach(() => {
//     console.log("After")
// })


describe("Actually testing our users in our task app", () => {
    test("Should sign up a new user", async () => {
        const response = await request(app)
        .post('/api/users').send({
            name: "Arvinder",
            email: "arvinder@example.com",
            password: "MyPass123!"
        }).expect(201)

        // Assert that the database was changed correctly

        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()

        // Assertions about the response
        expect(response.body).toMatchObject({
            user: {
                name: "Arvinder",
                email: "arvinder@example.com"
            },
            token: user.tokens[0].token
        })

    })

    test("Should login existing user", async() => {
        await request(app).post('/api/users/login').send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)
    })

    test("Should NOT login wrong credentials", async() => {
        await request(app).post('/api/users/login').send({
            email: "mikey@email.com",
            password: userOne.password
        }).expect(400)
    })

    test("Should get profile for user", async() => {
        await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    })

    test("Should not get profile for unauthenticated user", async() => {
        await request(app)
        .get("/api/users/me")
        .send()
        .expect(401)
    })

    test("Should delete account for authenticated user", async() => {
        await request(app)
        .delete("/api/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    })

    test("Should NOT delete account for unauthenticated user", async() => {
        await request(app)
        .delete("/api/users/me")
        .send()
        .expect(401)
     })
})