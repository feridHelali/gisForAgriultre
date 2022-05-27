import { success, notFound } from '../../services/response/'
import { Parcelle } from '.';


// export const create = ({ bodymen: { body } }, res, next) =>
//   Parcelle.create(body)
//     .then((parcelle) => parcelle.view(true))
//     .then(success(res, 201))
//     .catch(next)

export const create=async (req, res, next) =>{
  console.log("-------------------------------\n",req.user)
  if(req.user){
    req.body.user=req.user._id;
    try{
      let parcelle=await Parcelle.create(req.body);
      if(parcelle){
        await(async (parcelle)=>{
          success(res, 201)(parcelle.view(true))
        })(parcelle);
      }
    }catch(err){
      next(err);
    } 
  }else{
    notFound(res);
  }
   
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Parcelle.count(query)
    .then(count => Parcelle.find(query, select, cursor)
      .then((parcelles) => ({
        count,
        rows: parcelles.map((parcelle) => parcelle.view())
      }))
    )
    .then(success(res))
    .catch(next)
    
//SHOW
export const show = ({ params }, res, next) =>
  Parcelle.findOne({_id:params.id})
    .then(notFound(res))
    .then((parcelle) => parcelle ? parcelle.view() : null)
    .then(success(res))
    .catch(next)

//END SHOW
export const showMyAreas=async (req, res, next) =>{
  try{
    let myAreas=await Parcelle.find({user:req.user._id});
    if(myAreas){
      success(res, 200)(myAreas)
    }else{
      notFound();
    }
  }catch(e){
      res.json({message:e.message})
  }
  
  
}
export const update = ({ bodymen: { body }, params }, res, next) =>
  Parcelle.findById(params.id)
    .then(notFound(res))
    .then((parcelle) => parcelle ? Object.assign(parcelle, body).save() : null)
    .then((parcelle) => parcelle ? parcelle.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Parcelle.findById(params.id)
    .then(notFound(res))
    .then((parcelle) => parcelle ? parcelle.remove() : null)
    .then(success(res, 204))
    .catch(next)
