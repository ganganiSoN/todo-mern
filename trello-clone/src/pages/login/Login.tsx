import { useActionState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormControl,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router";

interface ILoginFormState {
  message: Record<string, string> | string | null;
  errors: Record<string, string> | null;
  fields?: Record<string, string> | null;
  variant: string;
}

async function loginAction(
  prevState: ILoginFormState,
  formData: FormData,
): Promise<ILoginFormState> {
  // const salt = await genSalt(10);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: Record<string, string> = {};

  if (!email && !email.includes("@")) {
    errors.email = "A valid email is required";
  }

  if (!password) {
    errors.password = "A valid password is required";
  }

  const previousFields = Object.fromEntries(formData) as Record<string, string>;

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: "Invalid form data",
      variant: "danger",
      fields: previousFields,
    };
  }

  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(previousFields),
  });

  const responseData = await response.json();

  errors.email = responseData.message?.email;
  errors.password = responseData.message?.password;

  if (!response.ok) {
    return {
      errors,
      message: responseData?.message,
      variant: "danger",
      fields: previousFields,
    };
  }

  return {
    errors,
    message: responseData?.message,
    variant: "success",
    fields: previousFields,
  };
}

function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: "",
    errors: {},
    fields: {},
    variant: "danger",
  });

  const navigator = useNavigate();

  useEffect(() => {
    if (state.variant === "success") {
      navigator("/home", {
        replace: true,
      });
    }
  });

  const goToSignUp = () => {
    navigator("/auth/signup");
  };

  return (
    <>
      <Card style={{ width: "25rem" }}>
        {state?.message ? (
          <Alert variant={state.variant}>{state?.message?.commonMessage}</Alert>
        ) : (
          ""
        )}
        <CardBody>
          <Form action={formAction} className="form-container">
            <FormControl
              required
              type="email"
              placeholder="Enter Email"
              name="email"
              className="mb-3"
              value={state.fields?.email}
            ></FormControl>
            <FormControl
              required
              type="password"
              placeholder="Enter Password"
              name="password"
              className="mb-3"
            ></FormControl>
            <Row>
              <Col>
                <Button variant="link" onClick={goToSignUp}>
                  Sign up?
                </Button>
              </Col>
              <Col>
                <Button variant="light" className="me-3">
                  Cancel
                </Button>

                <Button type="submit" variant="primary">
                  {isPending ? "Login..." : "Login"}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}

export default Login;
