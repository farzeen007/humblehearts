import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Home from "./pages/Dashboard/Home";
import HomeCare from "./pages/HomeCare/HomeCare";
import HomeCareRequest from "./pages/HomeCareRequest/HomeCareRequest";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoutes"; // Import your protected route component
import StudentManage from "./pages/StudentManage/StudentManage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Protected Routes */}
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute allowedRoles={['HOME_CARE']} />}>
              {/* <Route index path="/" element={<Home />} /> */}
              <Route index path="/student-manage" element={<StudentManage />} />
            </Route>

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route index path="/" element={<Home />} />
              <Route path="/homecare" element={<HomeCare />} />
              <Route path="/homecare-request" element={<HomeCareRequest />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}