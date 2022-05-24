import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Parcelle } from '.'

const app = () => express(apiRoot, routes)

let parcelle

beforeEach(async () => {
  parcelle = await Parcelle.create({})
})

test('POST /parcelles 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, position: 'test', proprietaire: 'test', nature: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.position).toEqual('test')
  expect(body.proprietaire).toEqual('test')
  expect(body.nature).toEqual('test')
})

test('POST /parcelles 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /parcelles 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /parcelles/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${parcelle.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(parcelle.id)
})

test('GET /parcelles/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /parcelles/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${parcelle.id}`)
    .send({ access_token: masterKey, position: 'test', proprietaire: 'test', nature: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(parcelle.id)
  expect(body.position).toEqual('test')
  expect(body.proprietaire).toEqual('test')
  expect(body.nature).toEqual('test')
})

test('PUT /parcelles/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${parcelle.id}`)
  expect(status).toBe(401)
})

test('PUT /parcelles/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, position: 'test', proprietaire: 'test', nature: 'test' })
  expect(status).toBe(404)
})

test('DELETE /parcelles/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${parcelle.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /parcelles/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${parcelle.id}`)
  expect(status).toBe(401)
})

test('DELETE /parcelles/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
