import {
  ChapterType,
  CourseTypeWithId,
  booksAndRefType,
  prevPaperType,
} from "src/models/course";

// Define action types
export const ACTION_TYPES = {
  SET_FIELD: "SET_FIELD",
  ADD_CHAPTER: "ADD_CHAPTER",
  UPDATE_CHAPTER: "UPDATE_CHAPTER",
  REMOVE_CHAPTER: "REMOVE_CHAPTER",
  ADD_REFERENCE: "ADD_REFERENCE",
  UPDATE_REFERENCE: "UPDATE_REFERENCE",
  REMOVE_REFERENCE: "REMOVE_REFERENCE",
  ADD_PREV_PAPER: "ADD_PREV_PAPER",
  UPDATE_PREV_PAPER: "UPDATE_PREV_PAPER",
  REMOVE_PREV_PAPER: "REMOVE_PREV_PAPER",
  RESET_COURSE: "RESET_COURSE",
} as const;
type Action =
  | {
      type: typeof ACTION_TYPES.SET_FIELD;
      field: keyof CourseTypeWithId;
      value: any;
    }
  | { type: typeof ACTION_TYPES.ADD_CHAPTER; chapter: ChapterType }
  | {
      type: typeof ACTION_TYPES.UPDATE_CHAPTER;
      index: number;
      chapter: ChapterType;
    }
  | { type: typeof ACTION_TYPES.REMOVE_CHAPTER; index: number }
  | { type: typeof ACTION_TYPES.ADD_REFERENCE; reference: booksAndRefType }
  | {
      type: typeof ACTION_TYPES.UPDATE_REFERENCE;
      index: number;
      reference: booksAndRefType;
    }
  | { type: typeof ACTION_TYPES.REMOVE_REFERENCE; index: number }
  | { type: typeof ACTION_TYPES.ADD_PREV_PAPER; prevPaper: prevPaperType }
  | {
      type: typeof ACTION_TYPES.UPDATE_PREV_PAPER;
      index: number;
      prevPaper: prevPaperType;
    }
  | { type: typeof ACTION_TYPES.REMOVE_PREV_PAPER; index: number }
  | { type: typeof ACTION_TYPES.RESET_COURSE };
// Reducer function
export const courseFormReducer = (
  state: CourseTypeWithId,
  action: Action
): CourseTypeWithId => {
  switch (action.type) {
    case ACTION_TYPES.SET_FIELD:
      return { ...state, [action.field]: action.value };
    case ACTION_TYPES.ADD_CHAPTER:
      return { ...state, chapters: [...state.chapters, action.chapter] };
    case ACTION_TYPES.UPDATE_CHAPTER:
      return {
        ...state,
        chapters: state.chapters.map((chap, i) =>
          i === action.index ? action.chapter : chap
        ),
      };
    case ACTION_TYPES.REMOVE_CHAPTER:
      return {
        ...state,
        chapters: state.chapters.filter((_, i) => i !== action.index),
      };
    case ACTION_TYPES.ADD_REFERENCE:
      return {
        ...state,
        books_and_references: [...state.books_and_references, action.reference],
      };
    case ACTION_TYPES.UPDATE_REFERENCE:
      return {
        ...state,
        books_and_references: state.books_and_references.map((ref, i) =>
          i === action.index ? action.reference : ref
        ),
      };
    case ACTION_TYPES.REMOVE_REFERENCE:
      return {
        ...state,
        books_and_references: state.books_and_references.filter(
          (_, i) => i !== action.index
        ),
      };
    case ACTION_TYPES.ADD_PREV_PAPER:
      return {
        ...state,
        prev_papers: [...state.prev_papers, action.prevPaper],
      };
    case ACTION_TYPES.UPDATE_PREV_PAPER:
      return {
        ...state,
        prev_papers: state.prev_papers.map((paper, i) =>
          i === action.index ? action.prevPaper : paper
        ),
      };
    case ACTION_TYPES.REMOVE_PREV_PAPER:
      return {
        ...state,
        prev_papers: state.prev_papers.filter((_, i) => i !== action.index),
      };
    case ACTION_TYPES.RESET_COURSE:
      return {
        ...state,
        name: "",
        code: "",
        credits: 0,
        department: "",
        type: "core",
        chapters: [],
        books_and_references: [],
        prev_papers: [],
      };
    default:
      return state;
  }
};
