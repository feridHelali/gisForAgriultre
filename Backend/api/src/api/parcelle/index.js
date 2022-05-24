import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Parcelle, { schema } from './model'

const router = new Router()
const { position, proprietaire, nature } = schema.tree

/**
 * @api {post} /parcelles Create parcelle
 * @apiName CreateParcelle
 * @apiGroup Parcelle
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam position Parcelle's position.
 * @apiParam proprietaire Parcelle's proprietaire.
 * @apiParam nature Parcelle's nature.
 * @apiSuccess {Object} parcelle Parcelle's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Parcelle not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ position, proprietaire, nature }),
  create)

/**
 * @api {get} /parcelles Retrieve parcelles
 * @apiName RetrieveParcelles
 * @apiGroup Parcelle
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of parcelles.
 * @apiSuccess {Object[]} rows List of parcelles.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /parcelles/:id Retrieve parcelle
 * @apiName RetrieveParcelle
 * @apiGroup Parcelle
 * @apiSuccess {Object} parcelle Parcelle's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Parcelle not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /parcelles/:id Update parcelle
 * @apiName UpdateParcelle
 * @apiGroup Parcelle
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam position Parcelle's position.
 * @apiParam proprietaire Parcelle's proprietaire.
 * @apiParam nature Parcelle's nature.
 * @apiSuccess {Object} parcelle Parcelle's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Parcelle not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ position, proprietaire, nature }),
  update)

/**
 * @api {delete} /parcelles/:id Delete parcelle
 * @apiName DeleteParcelle
 * @apiGroup Parcelle
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Parcelle not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
