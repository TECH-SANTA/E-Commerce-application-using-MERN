import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login } from "../../actions/userActions";
import MetaData from "../layouts/MetaData";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null); // 👈 Local state for error handling

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );

  // Handle redirect path
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") ? `/${searchParams.get("redirect")}` : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }

    if (error) {
      console.error("Login Error:", error);

      // Set local error and show toast
      setLocalError(error);
      toast.error(error, { position: toast.POSITION.BOTTOM_CENTER });

      // Clear error in Redux store (but keep it locally for UI feedback)
      dispatch(clearAuthError());
    }
  }, [error, isAuthenticated, dispatch, navigate, redirect]);

  return (
    <Fragment>
      <MetaData title="Login" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-3">Login</h1>

            {localError && <p className="text-danger">{localError}</p>} {/* 👈 Show persistent error */}

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              id="login_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <Link to='/register' className="float-right mt-3">
              New User?
            </Link>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
