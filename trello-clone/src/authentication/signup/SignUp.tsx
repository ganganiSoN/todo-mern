import { useActionState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  FormControl,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router";

interface FormState {
  message: string | null;
  errors: Record<string, string> | null;
  fields?: Record<string, string>;
  variant: string;
}

// useActionState Hook

async function signUpAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // const salt = await genSalt(10);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const errors: Record<string, string> = {};
  if (!email || !email.includes("@")) {
    errors.email = "A valid email is required.";
  }

  if (!password || password.length < 8) {
    errors.password = "A valid password is required.";
  }

  if (!name || name.length < 3) {
    errors.name = "A valid name is required.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      message: "Validation failed.",
      errors,
      fields: Object.fromEntries(formData) as Record<string, string>,
      variant: "danger",
    };
  }

  const dataObject = Object.fromEntries(formData);

  const response = await fetch("http://localhost:3000/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObject),
  });

  const responseData = await response.json();

  if (!response.ok) {
    errors.email = responseData.message?.email;

    return {
      message: "Signup Failed",
      errors: errors,
      fields: Object.fromEntries(formData) as Record<string, string>,
      variant: "danger",
    };
  }
  return {
    message: "Sign-up successful!",
    errors: null,
    fields: {},
    variant: "success",
  };
}

function SignUp() {
  const navigator = useNavigate();

  const [state, formAction, isPending] = useActionState(signUpAction, {
    errors: {},
    message: "",
    fields: {},
    variant: "success",
  });

  function gotoLoginPage() {
    navigator("/auth/login");
  }

  return (
    <>
      <Card style={{ width: "40rem" }} className="p-3 mt-3">
        {state.message ? (
          <Alert variant={state.variant}> {state.message} </Alert>
        ) : (
          ""
        )}

        <Form action={formAction} className="form-container">
          <Form.Group className="mb-3">
            <FormControl
              required
              type="text"
              placeholder="Enter Name"
              name="name"
              aria-invalid={!!state.errors?.name}
              value={state?.fields?.name}
              isInvalid={!!state.errors?.name}
            ></FormControl>
            <FormControl.Feedback type="invalid">
              {state.errors?.name}
            </FormControl.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <FormControl
              type="text"
              required
              placeholder="Enter Email"
              name="email"
              aria-invalid={!!state.errors?.email}
              value={state?.fields?.email}
              isInvalid={!!state.errors?.email}
            ></FormControl>
            <FormControl.Feedback type="invalid">
              {state.errors?.email}
            </FormControl.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <FormControl
              type="password"
              required
              placeholder="Enter Password"
              name="password"
              aria-invalid={!!state.errors?.password}
              isInvalid={!!state.errors?.password}
            ></FormControl>
            <FormControl.Feedback type="invalid">
              {state.errors?.password}
            </FormControl.Feedback>
          </Form.Group>
          <Row>
            <Col>
              <Button type="button" variant="link" onClick={gotoLoginPage}>
                Log In?
              </Button>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button variant="light" className="me-3" onClick={gotoLoginPage}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Signing Up..." : "Sign Up"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

export default SignUp;
