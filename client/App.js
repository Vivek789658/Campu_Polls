import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./Components/Home-page/Home";
import AdminPage from "./Components/admin-page/AdminPage";
import ProfessorPage from "./Components/professor-page/ProfessorPage";
import StudentPage from "./Components/student-page/StudentPage";
import Profile from "./Components/student-page/Profile";
import GiveFeedback from "./Components/student-page/GiveFeedback";
import SeeFeedback from "./Components/professor-page/SeeFeedback";
import ErrorPage from "./Components/Home-page/ErrorComponent";
import StudentNotifications from "./Components/student-page/Notifications";
import ProfessorNotification from "./Components/professor-page/ProfessorNotification";
import ContactPage from "./Components/Home-page/Contact";
import AboutPage from "./Components/Home-page/About";
import FeedbackForm from "./Components/student-page/FeedbackForm";
import Analytics from "./Components/student-page/Analytics";
import Login from "./Components/Home-page/login";
import FormDetailsPage from "./Components/student-page/FormDetailsPage";
import AdminFeedbackView from "./Components/admin-page/AdminFeedbackView";
import EditFeedbackForm from "./Components/admin-page/EditFeedbackForm";

function useUserType() {
  const userDataString = localStorage.getItem("userData");
  const { type } = userDataString ? JSON.parse(userDataString) : { type: null };
  return type;
}

function useRoutesForUser(userType) {
  switch (userType) {
    case "admin":
      return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackView />} />
          <Route path="/admin/edit-feedback-form/:formName" element={<EditFeedbackForm />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      );
    case "professor":
      return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/professor" element={<ProfessorPage />} />
          <Route path="/user/:_id" element={<Profile />} />
          <Route path="/see-feedback/:feedbackFormName" element={<SeeFeedback />} />
          <Route path="/professor/notifications" element={<ProfessorNotification />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/feedback/:formName" element={<FeedbackForm />} />
          <Route path="/student/form-details/:formName" element={<FormDetailsPage />} />
          <Route path="/feedback/:formId" element={<FeedbackForm />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      );
    case "student":
      return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/user/:_id" element={<Profile />} />
          <Route path="/give-feedback/:formName" element={<GiveFeedback />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/student/analytics" element={<Analytics />} />
          <Route path="/student/form-details/:formName" element={<FormDetailsPage />} />
          <Route path="/feedback/:formName" element={<FeedbackForm />} />
          <Route path="/feedback/:formId" element={<FeedbackForm />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      );
    default:
      return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      );
  }
}

const AppLayout = () => {
  const userType = useUserType();
  const routes = useRoutesForUser(userType);

  return <div>{routes}</div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <AppLayout />
  </Router>
);
