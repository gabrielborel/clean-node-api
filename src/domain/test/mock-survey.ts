import { SurveyModel } from "@/domain/models/survey";
import { CreateSurveyParams } from "../use-cases/survey/create-survey";

export const mockSurveyModels = (): SurveyModel[] => [
  {
    id: "any_id",
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  },
  {
    id: "other_id",
    question: "other_question",
    answers: [
      {
        image: "other_image",
        answer: "other_answer",
      },
    ],
    date: new Date(),
  },
];

export const mockSurveyModel = (): SurveyModel => mockSurveyModels()[0];

export const mockCreateSurveyParams = (): CreateSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
  date: new Date(),
});
