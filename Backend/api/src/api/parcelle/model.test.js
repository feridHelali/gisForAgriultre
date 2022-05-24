import { Parcelle } from '.'

let parcelle

beforeEach(async () => {
  parcelle = await Parcelle.create({ position: 'test', proprietaire: 'test', nature: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = parcelle.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(parcelle.id)
    expect(view.position).toBe(parcelle.position)
    expect(view.proprietaire).toBe(parcelle.proprietaire)
    expect(view.nature).toBe(parcelle.nature)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = parcelle.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(parcelle.id)
    expect(view.position).toBe(parcelle.position)
    expect(view.proprietaire).toBe(parcelle.proprietaire)
    expect(view.nature).toBe(parcelle.nature)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
