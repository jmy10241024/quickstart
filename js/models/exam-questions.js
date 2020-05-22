const defaultQuestions = {
  duration: 600,
  examAnswer: [],
  examRecord: {},
  hasUndoen: true,
  questions: [],
  quiz_hosts: {},
};
export const examQuestions = {
  default: defaultQuestions,
  persist: false,
  actions: {
    UPDATE_EXAM_QUESTIONS: {
      reducer: 'SET',
    },
    CLEAR_EXAM_QUESTIONS: {
      reducer: () => defaultQuestions,
    },
  },
};
