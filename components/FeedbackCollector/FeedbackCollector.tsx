import { useState } from "react";

import { track } from "../../utils/tracking";
import ThumbsDownIcon from "../svg/ThumbsDown";
import ThumbsUpIcon from "../svg/ThumbsUp";
import Modal from "react-modal";

import style from "./FeedbackCollector.module.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    borderRadius: "16px",
    transform: "translate(-50%, -50%)",
  },
};

const scheduleLink = `https://calendly.com/d/ckzh-2ym-kpx/talk-to-a-mixpanel-pm`;

export function FeedbackCollector() {
  const [gaveFeedback, setGaveFeedback] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackSumitterEmail, setFeedbackSumitterEmail] = useState(``);
  const [feedbackContent, setFeedbackContent] = useState(``);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = function (isPositive: boolean) {
    // changelogs don't have h1s
    const props = {
      title: document.querySelector(`h1`)?.textContent || document.title,
    };
    track(isPositive ? `Docs Promoter` : `Docs Detractor`, props);
    setGaveFeedback(true);

    // reset feedback to 5 seconds
    setTimeout(() => {
      setGaveFeedback(false);
    }, 5000);
  };

  const submitFeedbackButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFeedbackSumitterEmail(``);
    setFeedbackContent(``);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    track(`Docs feedback sumitted`, {
      email: feedbackSumitterEmail,
      feedback: feedbackContent,
    });
    setFeedbackSumitterEmail(``);
    setFeedbackContent(``);
    setSubmitted(true);
  };

  return (
    <div className="feedbackCollectorContainer">
      <div className="feedbackCollectorRoot">
        {gaveFeedback ? (
          <p className="feedbackThankYouText">Thanks for your feedback!</p>
        ) : (
          <>
            <p className="feedbackQuestionTitle">Was this page useful?</p>
            <div className="feedbackButtonContainer">
              <button
                className="feedbackButton"
                onClick={() => handleFeedback(true)}
              >
                Yes
                <span className="feedbackThumbsUpIcon">
                  <ThumbsUpIcon />
                </span>
              </button>
              <button
                className="feedbackButton"
                onClick={() => handleFeedback(false)}
              >
                Could be better
                <span className="feedbackThumbsDownIcon">
                  <ThumbsDownIcon />
                </span>
              </button>
            </div>
            <div>
              <button
                className={style.feedbackSubmitButtonText}
                onClick={submitFeedbackButtonClick}
              >
                {" "}
                Or Submit a feedback.{" "}
              </button>
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => handleModalClose()}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {!submitted ? (
          <>
            <p className={style.submitFeedback}>Submit Feedback</p>
            <div>
              <p> Your Email (optional) </p>
              <input
                placeholder={`jane@email.com`}
                onChange={(e) => setFeedbackSumitterEmail(e.target.value)}
                className={style.emailInput}
                type={"email"}
              />
            </div>
            <textarea
              placeholder={`Your feecback...`}
              onChange={(e) => setFeedbackContent(e.target.value)}
              className={style.feedbackTextArea}
            />
            <p>
              {" "}
              Would a call be easier? Grab time with a Mixpanel PM{" "}
              <a
                target="_blank"
                className={style.scheduleCallAnchorTag}
                rel="noopener noreferrer"
                href={scheduleLink}
              >
                {" "}
                here.
              </a>{" "}
            </p>
            <div className={style.buttonContainer}>
              <button
                className={style.cancelButton}
                onClick={() => handleModalClose()}
              >
                {" "}
                Cancel{" "}
              </button>
              <button
                className={style.submitButton}
                onClick={() => handleSubmit()}
              >
                {" "}
                Submit{" "}
              </button>
            </div>
          </>
        ) : (
          <div>
            <p className={style.submitFeedback}>
              Thank you for submitting feedback
            </p>
            <div className={style.buttonContainer}>
              <button
                className={style.cancelButton}
                onClick={() => handleModalClose()}
              >
                {" "}
                Close{" "}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
