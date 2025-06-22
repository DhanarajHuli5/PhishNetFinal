import {body} from "express-validator"

const userRegistrationValidator = () => {
    return [
        body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is not valid"),
        body('username')
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({min: 3}).withMessage("Username must be at least 3 characters long")
        .isLength({max: 13}).withMessage("Username must be at most 13 characters long")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username must contain only letters, numbers, and underscores"),
        body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({min: 8}).withMessage("Password must be at least 8 characters long"),

    ]
}

const userLoginValidator = () => {
    return [
        body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is not valid"),
        body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
    ]
}

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgottenPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

export {userRegistrationValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userResetForgottenPasswordValidator}
