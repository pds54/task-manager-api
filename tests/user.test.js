const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Sign-Up User', async () => {
  const response = await request(app).post('/users').send({
    name: 'Michael Scott',
    email: 'dunder@mifflin.com',
    password: 'P@rkour!'
  }).expect(201)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: 'Michael Scott',
      email: 'dunder@mifflin.com'
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('P@rkour!')
})

test('Log-In User Valid', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Log-In User Invalid', async () => {
  await request(app).post('/users/login').send({
    email: 'mr@meeseeks.com',
    password: 'Look@Me'
  }).expect(400)
})

test('Get User Profile Valid', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Get User Profile Invalid', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Update User Valid', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Morty'
    })
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Morty')
})

test('Update User Invalid', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'C-137'
    })
    .expect(400)
})

test('Delete User Valid', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Delete User Invalid', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Upload Avatar Valid', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})
