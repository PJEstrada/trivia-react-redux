import React from "react";
import TrueFalseQuestion from "../TrueFalseQuestion";

const QuestionRenderer = props => {
  const { questionObj } = props;
  const { type, category, question, categorySlug } = questionObj;
  let component = null;
  if (type === "boolean") {
    component = (
      <TrueFalseQuestion
        type={type}
        id={questionObj.id}
        category={category}
        categorySlug={categorySlug}
        question={question}
      />
    );
  }
  return component;
};

export default QuestionRenderer;
