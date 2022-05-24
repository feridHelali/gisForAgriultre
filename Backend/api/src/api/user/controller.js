import { success, notFound } from "../../services/response/";
import { User } from ".";
import { sign } from "../../services/jwt";
import {sendMail} from "../../services/nodemailer/nodemailer.service";

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.count(query)
    .then((count) =>
      User.find(query, select, cursor).then((users) => ({
        rows: users.map((user) => user.view()),
        count,
      }))
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.view() : null))
    .then(success(res))
    .catch(next);

export const showMe = ({ user }, res) => res.json(user.view(true));

//-------------------------------------------------------------
// export const create = ({ bodymen: { body } }, res, next) =>
//   User.create(body)
//     .then(user => {
//       sign(user.id)
//         .then((token) => ({ token, user: user.view(true) }))
//         .then(success(res, 201))
//     })
//     .catch((err) => {
//       /* istanbul ignore else */
//       if (err.name === 'MongoError' && err.code === 11000) {
//         res.status(409).json({
//           valid: false,
//           param: 'email',
//           message: 'email already registered'
//         })
//       } else {
//         next(err)
//       }
//     })

export const create = async ({ bodymen: { body } }, res, next) => {
  try {
    let user = await User.create(body);
    let token = await sign(user.id);
    let result=await sendVerification(user.email, token);
    if(result){
      await (async (token) => {
      success(res, 201)({ token, user: user.view(true) });
      // body.token=token;
      console.log("..........", token, ".............", body);
    })(token);
    }else{
      success(res, 400)({message:"Try to verify"})
    }
    
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      res.status(409).json({
        valid: false,
        param: "email",
        message: "email already registered",
      });
    } else {
      next(err);
    }
  }
};


const verify = async (_email, _token) => {
  try {
    let _user = null;
    _user = await User.findOne({ email: _email, token: _token }); //does the user exists
    // an already activated account
    if (!_user) {
      _user = await User.findOne({ email: _email });
      if (_user.activated) _user.activated = true;
    }
    //is it a pending activation
    if (_user && !_user.verified) {
      _user = await User.findOneAndUpdate(
        { email: _email, token: _token },
        { activated: true, $unset: { token: 1 } }
      );
      console.log("user", _user);
    }
    return _user;
  } catch (e) {
    throw e;
  }
};

export const activateAccount = async ({ bodymen: { body } }, res, next) => {
  try {
    let user = await verify(req.query.email, req.query.token);
    console.log(user.alreadyVerified);
    if (user.alreadyVerified) {
      res.status(200).json({ message: "Your account is already activated" });
    } else if (user)
      res.status(200).json({ message: "Your account has been activated" });
    else {
      res
        .status(400)
        .json({ message: "There was an error while activating your account" });
    }
  } catch (e) {
    console.log(e.message);
    res
      .status(400)
      .json({ message: "There was an error while activating your account" });
  }
};

export const sendVerification = async (email,token) => {

  let result = await sendMail(email, token);
  return result;
}
//-----------------------------------------------
export const update = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isAdmin = user.role === "admin";
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: "You can't change other user's data",
        });
        return null;
      }
      return result;
    })
    .then((user) => (user ? Object.assign(user, body).save() : null))
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const updatePassword = (
  { bodymen: { body }, params, user },
  res,
  next
) =>
  User.findById(params.id === "me" ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null;
      const isSelfUpdate = user.id === result.id;
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: "password",
          message: "You can't change other user's password",
        });
        return null;
      }
      return result;
    })
    .then((user) =>
      user ? user.set({ password: body.password }).save() : null
    )
    .then((user) => (user ? user.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => (user ? user.remove() : null))
    .then(success(res, 204))
    .catch(next);
