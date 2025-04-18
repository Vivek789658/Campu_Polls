import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../student-page/Header";
import FeedbackViewPage from "./FeedbackViewPage";
import { useParams } from "react-router-dom";

const SeeFeedback = () => {
  const { feedbackFormName } = useParams();
  return (
    <div>
      <Header></Header>
      <FeedbackViewPage feedbackFormName={feedbackFormName}></FeedbackViewPage>
    </div>
  );
};

export default SeeFeedback;
