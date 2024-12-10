import axios from "axios";
import { useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PageAnimation from "../common/PageAnimation";
import InputComponent from "../components/InputComponent";
import googleIcon from "../images/google.png";

const UserAuthFormPage = ({ type }) => {
  const authForm = useRef();

  const navigate = useNavigate();

  // const userAuthThroughServer = async (serverRoute, formData) => {
  //   try {
  //     const { data } = await axios.post(
  //       // import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
  //       "http://localhost:3001/signup",
  //       // "http://localhost:3001/signin",
  //       formData
  //     );

  //     console.log(data);
  //     // Handle successful login/signup (e.g., save token, redirect, etc.)
  //   } catch ({ response }) {
  //     toast.error(response.data.error);
  //   }
  // };

  const userAuthThroughServer = async (serverRoute, formData) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001" + serverRoute, // Fixed URL concatenation
        formData
      );

      console.log(data);

      // On successful authentication, perform the appropriate redirect
      if (serverRoute === "/signup") {
        // Redirect to signin page after successful signup
        toast.success("Signup successful! Please sign in.");
        navigate("/signin");
      } else if (serverRoute === "/signin") {
        // Redirect to home page after successful signin
        toast.success("Signin successful!");
        // navigate("/home"); // Assuming "/home" is the home page
        navigate("/"); // Assuming "/home" is the home page
      }
    } catch ({ response }) {
      toast.error(response.data.error); // Handle errors from server response
    }
  };

  const hadleSubmit = (e) => {
    e.preventDefault();

    const serverRoute = type == "sign-in" ? "/signin" : "/signup";

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=<>?]).{8,20}$/;

    const form = new FormData(authForm.current);
    const formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
      console.log(formData);
    }

    const { fullName, email, password } = formData;

    // Validation checks
    if (fullName) {
      if (fullName.length < 3) {
        return toast.error("fullName must be at least 3 characters long");
      }
    }

    if (!email.length) {
      return toast.error("Email is required");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be 8-20 characters long, include uppercase, lowercase, numbers, and special characters"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  return (
    <>
      <PageAnimation keyValue={type}>
        <section className="h-cover flex items-center justify-center">
          <Toaster />
          <form className="w-[80%] max-w-0[400px]" ref={authForm}>
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
              {type == "sign-in" ? "Welcome back" : "Join us today"}
            </h1>
            {type != "sign-in" ? (
              <InputComponent
                name="fullName"
                type="text"
                placeholder="Full name"
                icon="fi-rr-user"
              />
            ) : (
              ""
            )}

            <InputComponent
              name="email"
              type="email"
              placeholder="Email"
              icon="fi-rr-envelope"
            />

            <InputComponent
              name="password"
              type="password"
              placeholder="Password"
              icon="fi-rr-key"
            />

            <button
              className="btn-dark center mt-14"
              type="submit"
              onClick={hadleSubmit}
            >
              {type.replace("-", " ")}
            </button>

            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>or</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
              <img src={googleIcon} alt="Google Logo" className="w-5" />
              Continue with Google
            </button>

            {type == "sign-in" ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account ?
                <Link
                  to="/signup"
                  className="underline text-black text-xl ml-1"
                >
                  Join us
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Already a member ?
                <Link
                  to="/signin"
                  className="underline text-black text-xl ml-1"
                >
                  Sign in here
                </Link>
              </p>
            )}
          </form>
        </section>
      </PageAnimation>
    </>
  );
};

export default UserAuthFormPage;
