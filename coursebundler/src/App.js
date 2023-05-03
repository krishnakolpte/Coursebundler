import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import About from './components/about/About';
import AdminCourses from './components/admin/AdminCourses/AdminCourses';
import CreateCourse from './components/admin/CreateCourse/CreateCourse';
import Dashboard from './components/admin/dashboard/Dashboard';
import Users from './components/admin/Users/Users';
import ForgetPassword from './components/auth/ForgetPassword';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import Contact from './components/contact/Contact';
import CoursePage from './components/coursePage/CoursePage';
import Courses from './components/courses/Courses';
import Home from './components/home/Home';
import Footer from './components/layout/footer/Footer';
import Header from './components/layout/Header';
import NotFound from './components/layout/NotFound';
import PaymentFail from './components/payments/PaymentFail';
import PaymentSuccess from './components/payments/PaymentSuccess';
import Subscibe from './components/payments/Subscibe';
import ChangePassword from './components/profile/ChangePassword';
import Profile from './components/profile/Profile';
import UpdateProfile from './components/profile/UpdateProfile';
import Requestcourse from './components/request/Requestcourse';
import toast, { Toaster } from 'react-hot-toast';
import { loadUser } from './redux/Actions/user';
import { ProtectedRoute } from 'protected-route-react';
import Loader from './components/layout/Loader';
import DeleteAccount from './components/profile/DeleteAccount';

function App() {
  const { isAuthenticated, user, message, error, loading } = useSelector(
    state => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
    return () => {};
  }, [dispatch, error, message]);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <>
        <Header isAuthenticated={isAuthenticated} user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/course/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CoursePage user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deleteaccount"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DeleteAccount user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateprofile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdateProfile user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/changepassword"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <ProtectedRoute
                isAuthenticated={!isAuthenticated}
                redirect="/profile"
              >
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute
                isAuthenticated={!isAuthenticated}
                redirect="/profile"
              >
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Requestcourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgetpassword"
            element={
              <ProtectedRoute
                isAuthenticated={!isAuthenticated}
                redirect="/profile"
              >
                <ForgetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resetpassword/:token"
            element={
              <ProtectedRoute
                isAuthenticated={!isAuthenticated}
                redirect="/profile"
              >
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscribe"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Subscibe user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/paymentfail" element={<PaymentFail />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={user && user.role === 'admin'}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/createcourse"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={user && user.role === 'admin'}
              >
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={user && user.role === 'admin'}
              >
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={user && user.role === 'admin'}
              >
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <Toaster />
      </>
      {/* )} */}
    </>
  );
}

export default App;
