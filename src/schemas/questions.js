// @flow
import { schema } from "normalizr";

export const question = new schema.Entity("question");
export const arrayOfQuestions = new schema.Array(question);
