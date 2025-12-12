import { memo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { validateEmail } from "../utils/validation";

// Import validation.js to register the custom Yup method
import "../utils/validation";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .required("Email is required")
    .test('email-strict', 'Please enter a valid email address', function(value) {
      if (!value) return true; // Let required() handle empty values
      const result = validateEmail(value);
      if (!result.isValid) {
        return this.createError({ message: result.error });
      }
      return true;
    }),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const AccountForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values.email, values.password);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        style={{
          margin: "1rem",
        }}
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        style={{
          margin: "1rem",
        }}
      />
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        size="small"
        style={{
          margin: "1rem",
        }}
      >
        Submit
      </Button>
    </form>
  );
};

export default memo(AccountForm);
