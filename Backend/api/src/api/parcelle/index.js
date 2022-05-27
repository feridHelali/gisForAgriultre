import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { master, token } from "../../services/passport";
import { create, index, show, update, destroy, showMyAreas } from "./controller";
import { schema } from "./model";

export Parcelle, { schema } from "./model";

const router = new Router();
const { proprietaire, position, nature } = schema.tree;

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
router.post(
  "/",
  body(proprietaire, position, nature),
  token({ required: true, roles: ["user"] }),
  create
);

/**
 * @api {get} /parcelles Retrieve parcelles
 * @apiName RetrieveParcelles
 * @apiGroup Parcelle
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of parcelles.
 * @apiSuccess {Object[]} rows List of parcelles.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get(
  "/",
  query(),
  token({ required: true, roles: ["admin"] }),
  index
);

/**
 * @api {get} /parcelles/:id Retrieve parcelle
 * @apiName RetrieveParcelle
 * @apiGroup Parcelle
 * @apiSuccess {Object} parcelle Parcelle's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Parcelle not found.
 */
router.get("/:id", token({ required: true, roles: ["user"] }), show);

//
 router.get("/my/areas",
 token({ required: true, roles: ["user"] }),
 showMyAreas
);


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
router.put("/:id",
  token({ required: true, roles: ["user"] }),
  body({ position, proprietaire, nature }),
  update
);

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
router.delete("/:id", 
token({ required: true, roles: ["user"] }), 
destroy);

export default router;
