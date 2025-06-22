import { Router } from "express";
import {changeCurrentPassword, forgotPasswordRequest, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgottenPassword, verifyEmail} from "../controllers/auth.controllers.js"
import {validate} from "../middlewares/validate.middleware.js"
import {userChangeCurrentPasswordValidator, userForgotPasswordValidator, userRegistrationValidator, userResetForgottenPasswordValidator} from "../validators/index.js"
import { getLoggedInUser, verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(userRegistrationValidator(), validate, registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(getLoggedInUser, logoutUser)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/verify-email/:token").get(verifyEmail);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)
router.route("/refresh-access-token").post(verifyJWT, refreshAccessToken)
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(),validate,changeCurrentPassword)
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest)
router.route("/reset-password/:token").post(userResetForgottenPasswordValidator(), validate, resetForgottenPassword)

export default router;
