import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Home from "./pages/(admin)/Dashboard/Home";
import HomeCare from "./pages/(admin)/HomeCare/HomeCare";
import HomeCareRequest from "./pages/(admin)/HomeCareRequest/HomeCareRequest";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoutes";
import SignInHomeCare from "./pages/AuthPages/SignInHomeCare";
import StudentRequest from "./pages/(homecare)/StudentRequest/StudentRequest";
import StudentAssigned from "./pages/(homecare)/StudentAssigned/StudentAssigned";
import StudentAvailability from "./pages/(admin)/StudentAvailability/StudentAvailability";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signin-homecare" element={<SignInHomeCare />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Protected Routes */}
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["HOME_CARE"]} />}>
              {/* <Route index path="/" element={<Home />} /> */}
              <Route
                index
                path="/student-request"
                element={<StudentRequest />}
              />
              <Route
                index
                path="/student-assigned"
                element={<StudentAssigned />}
              />
            </Route>

            {/* User Protected Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />
              }
            >
              <Route index path="/" element={<Home />} />
              <Route path="/homecare" element={<HomeCare />} />
              <Route path="/homecare-request" element={<HomeCareRequest />} />
              <Route
                path="/student-availablity"
                element={<StudentAvailability />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
