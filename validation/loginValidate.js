import * as Yup from "yup";
import { makeValidate } from "mui-rff";
import { emailUsername, password } from "./commonValidation";

const loginValidate = makeValidate(
  Yup.object().shape({
    emailUsername: emailUsername,
    password: password,
  })
);

export default loginValidate;
