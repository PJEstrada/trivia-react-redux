import React from "react";
import Button from "@material-ui/core/Button";
import * as styles from "./styles";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";

const Answer = props => {
  const { isCorrect, title } = props;
  return (
    <div style={styles.answer}>
      {isCorrect ? (
        <FaPlus style={styles.iconStyle} />
      ) : (
        <FaMinus style={styles.iconStyle} />
      )}

      <p style={styles.answerText}>{title}</p>
    </div>
  );
};

export default Answer;
