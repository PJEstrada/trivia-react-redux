import React from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import * as answersActions from "../../actions/answers";
import * as styles from "./styles";
import {
  FaGamepad,
  FaGlobeAmericas,
  FaMusic,
  FaCarSide,
  FaBook,
  FaArchway,
  FaTree,
  FaDungeon,
  FaFilm,
  FaFistRaised,
  FaCalculator,
  FaChessBoard,
  FaTv,
  FaZhihu,
  FaGem,
  FaLaptop,
  FaPaintBrush
} from "react-icons/fa";

const ICONS = {
  entertainment__video_games: <FaGamepad style={styles.categoryIcon} />,
  entertainment__music: <FaMusic style={styles.categoryIcon} />,
  entertainment__books: <FaBook style={styles.categoryIcon} />,
  science__mathematics: <FaCalculator style={styles.categoryIcon} />,
  entertainment__japanese_anime_manga: <FaZhihu style={styles.categoryIcon} />,
  art: <FaPaintBrush style={styles.categoryIcon} />,
  science__computers: <FaLaptop style={styles.categoryIcon} />,
  history: <FaArchway style={styles.categoryIcon} />,
  celebrities: <FaGem style={styles.categoryIcon} />,
  science_nature: <FaTree style={styles.categoryIcon} />,
  mythology: <FaDungeon style={styles.categoryIcon} />,
  politics: <FaFistRaised style={styles.categoryIcon} />,
  entertainment__comics: <FaBook style={styles.categoryIcon} />,
  entertainment__television: <FaTv style={styles.categoryIcon} />,
  entertainment__film: <FaFilm style={styles.categoryIcon} />,
  vehicles: <FaCarSide style={styles.categoryIcon} />,
  entertainment__board_games: <FaChessBoard style={styles.categoryIcon} />,
  general_knowledge: <FaGlobeAmericas style={styles.categoryIcon} />,
  default: <FaGlobeAmericas style={styles.categoryIcon} />
};

class TrueFalseQuestion extends React.Component {
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }
  render() {
    const {
      question,
      category,
      startCreatingAnswer,
      id,
      categorySlug
    } = this.props;

    return (
      <div
        style={{
          ...styles.trueFalseQuestionContainer,
          ...styles[`defaultBackground`],
          ...styles[`${categorySlug}Background`]
        }}
      >
        <h1 className={"questionCategory"} style={styles.categoryText}>
          {category}
        </h1>
        <h2 className={"questionTitle"} style={styles.questionText}>
          {question}
        </h2>
        <div style={styles.answersContainer}>
          <Button
            className={"trueButton"}
            onClick={() => startCreatingAnswer(id, true)}
            style={{ ...styles.button, ...styles.trueButton }}
            variant="contained"
          >
            True
          </Button>
          <Button
            className={"falseButton"}
            onClick={() => startCreatingAnswer(id, false)}
            style={{ ...styles.button, ...styles.falseButton }}
            variant="contained"
          >
            False
          </Button>
        </div>
        <div
          style={{
            ...styles.iconContainer,
            ...styles[`defaultIconColor`],
            ...styles[`${categorySlug}IconColor`]
          }}
        >
          {ICONS[categorySlug] ? ICONS[categorySlug] : ICONS["default"]}
        </div>
      </div>
    );
  }
}

const TrueFalseQuestionConnected = connect(
  (state, props) => ({ ...props }),
  dispatch => ({
    startCreatingAnswer: (questionId, value) =>
      dispatch(answersActions.startCreatingAnswer(questionId, value))
  })
)(TrueFalseQuestion);

export default TrueFalseQuestionConnected;
