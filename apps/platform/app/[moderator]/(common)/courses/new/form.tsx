"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MinusCircle, Plus, Send } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReducer } from "react";
import toast from "react-hot-toast";
import {
  ChapterType,
  CourseType,
  booksAndRefType,
  prevPaperType,
} from "src/models/course";
import { ACTION_TYPES, courseFormReducer } from "./store";

export default function NewCourseForm({
  departments,
  saveCourse,
}: {
  departments: string[];
  saveCourse: (courseData: CourseType) => Promise<CourseType>;
}) {
  const [state, dispatch] = useReducer(courseFormReducer, {
    name: "",
    code: "",
    credits: 0,
    department: "",
    type: "core",
    chapters: [],
    books_and_references: [],
    prev_papers: [],
  } as CourseType);

  const {
    name,
    code,
    credits,
    department,
    type,
    chapters,
    books_and_references,
    prev_papers,
  } = state;
  const handleChange = (field: keyof CourseType, value: any) => {
    dispatch({ type: ACTION_TYPES.SET_FIELD, field, value });
  };

  const handleChapterAction = (action: string, payload: any) => {
    dispatch({ type: action, ...payload });
  };

  const handleReferenceAction = (action: string, payload: any) => {
    dispatch({ type: action, ...payload });
  };

  const handlePrevPaperAction = (action: string, payload: any) => {
    dispatch({ type: action, ...payload });
  };

  return (
    <>
      {" "}
      <CardContent className="space-y-4">
        <div className="grid gap-4 w-full grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Course Name"
              variant="fluid"
              value={name}
              onChange={(e) => {
                handleChange("name", e.currentTarget.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              placeholder="Course Code"
              variant="fluid"
              value={code}
              onChange={(e) => {
                handleChange("code", e.currentTarget.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              name="credits"
              placeholder="Credits"
              variant="fluid"
              defaultValue={0}
              type="number"
              value={credits}
              onChange={(e) => {
                handleChange("credits", parseInt(e.currentTarget.value));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="department">Department</Label>

            <Select
              name="department"
              value={department}
              onValueChange={(value) => {
                handleChange("department", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {[...departments, "Humanities and Social Sciences"].map(
                  (department) => (
                    <SelectItem value={department} key={department}>
                      {department}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              name="type"
              value={type}
              onValueChange={(value) => {
                handleChange("type", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="elective">Elective</SelectItem>
                <SelectItem value="lab">Lab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-col gap-4 w-full">
            <Label htmlFor="content" className="font-bold">
              Chapters
            </Label>
            {chapters.map((chapter: ChapterType, index: number) => {
              return (
                <div className="flex flex-col gap-2" key={`chapter-${index}`}>
                  <Label htmlFor={`chapter-${index}-name`}>
                    Chapter {index + 1}
                  </Label>
                  <div className="flex flex-row gap-2">
                    <Input
                      id={`chapter-${index}-name`}
                      name={`chapter-${index}-name`}
                      placeholder="Chapter Name"
                      variant="fluid"
                      value={chapter.title}
                      onChange={(e) => {
                        handleChapterAction(ACTION_TYPES.UPDATE_CHAPTER, {
                          index,
                          chapter: {
                            ...chapter,
                            title: e.currentTarget.value,
                          },
                        });
                      }}
                    />
                    <Input
                      id={`chapter-${index}-lectures`}
                      name={`chapter-${index}-lectures`}
                      placeholder="Lectures"
                      type="number"
                      defaultValue={0}
                      variant="fluid"
                      value={chapter.lectures}
                      onChange={(e) => {
                        handleChapterAction(ACTION_TYPES.UPDATE_CHAPTER, {
                          index,
                          chapter: {
                            ...chapter,
                            lectures: parseInt(e.currentTarget.value),
                          },
                        });
                      }}
                    />
                    <Button
                      size="icon"
                      variant="destructive_light"
                      onClick={() => {
                        handleChapterAction(ACTION_TYPES.REMOVE_CHAPTER, {
                          index,
                        });
                      }}
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Textarea
                      id={`chapter-${index}-topics`}
                      name={`chapter-${index}-topics`}
                      placeholder="Topics"
                      variant="fluid"
                      value={chapter.topics.join(",")}
                      onChange={(e) => {
                        handleChapterAction(ACTION_TYPES.UPDATE_CHAPTER, {
                          index,
                          chapter: {
                            ...chapter,
                            topics: e.currentTarget.value.split(","),
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <Button
              onClick={() => {
                handleChapterAction(ACTION_TYPES.ADD_CHAPTER, {
                  chapter: {
                    title: "",
                    lectures: 0,
                    topics: [],
                  },
                });
              }}
              className="max-w-xs"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Chapter
            </Button>
          </div>
          <div className="grid gap-4 w-full">
            <Label htmlFor="content">Books and References</Label>
            {books_and_references.map(
              (reference: booksAndRefType, index: number) => {
                return (
                  <div
                    className="flex flex-col gap-2"
                    key={`reference-${index}`}
                  >
                    <Label htmlFor={`reference-${index}-name`}>
                      Reference {index + 1}
                    </Label>
                    <Input
                      id={`reference-${index}-name`}
                      name={`reference-${index}-name`}
                      placeholder="Reference Name"
                      variant="fluid"
                      value={reference.name}
                      onChange={(e) => {
                        handleReferenceAction(ACTION_TYPES.UPDATE_REFERENCE, {
                          index,
                          reference: {
                            ...reference,
                            name: e.currentTarget.value,
                          },
                        });
                      }}
                    />
                    <div className="flex flex-row gap-2">
                      <Input
                        id={`reference-${index}-author`}
                        name={`reference-${index}-author`}
                        placeholder="Link"
                        variant="fluid"
                        value={reference.link}
                        onChange={(e) => {
                          handleReferenceAction(ACTION_TYPES.UPDATE_REFERENCE, {
                            index,
                            reference: {
                              ...reference,
                              link: e.currentTarget.value,
                            },
                          });
                        }}
                      />
                      <Select
                        name={`reference-${index}-type`}
                        value={reference.type}
                        onValueChange={(value) => {
                          handleReferenceAction(ACTION_TYPES.UPDATE_REFERENCE, {
                            index,
                            reference: {
                              ...reference,
                              type: value as booksAndRefType["type"],
                            },
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "book",
                            "reference",
                            "drive",
                            "youtube",
                            "others",
                          ].map((type) => (
                            <SelectItem value={type} key={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="destructive_light"
                        onClick={() => {
                          handleReferenceAction(ACTION_TYPES.REMOVE_REFERENCE, {
                            index,
                          });
                        }}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              }
            )}
            <Button
              onClick={() => {
                handleReferenceAction(ACTION_TYPES.ADD_REFERENCE, {
                  reference: {
                    name: "",
                    link: "",
                    type: "book",
                  },
                });
              }}
              className="max-w-xs"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Reference
            </Button>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Label htmlFor="content">Previous Papers</Label>
            {prev_papers.map((prevPaper: prevPaperType, index: number) => {
              return (
                <div
                  className="flex flex-col gap-2"
                  key={`prev_papers-${index}`}
                >
                  <Label htmlFor={`prevPaper-${index}-link`}>
                    Previous Paper {index + 1}
                  </Label>
                  <Input
                    id={`prevPaper-${index}-link`}
                    name={`prevPaper-${index}-link`}
                    type="url"
                    placeholder="Paper Link"
                    variant="fluid"
                    value={prevPaper.link}
                    onChange={(e) => {
                      handlePrevPaperAction(ACTION_TYPES.UPDATE_PREV_PAPER, {
                        index,
                        prevPaper: {
                          ...prevPaper,
                          link: e.currentTarget.value,
                        },
                      });
                    }}
                  />
                  <div className="flex flex-row gap-2">
                    <Select
                      name={`reference-${index}-type`}
                      value={prevPaper.exam}
                      onValueChange={(value) => {
                        handlePrevPaperAction(ACTION_TYPES.UPDATE_PREV_PAPER, {
                          index,
                          prevPaper: {
                            ...prevPaper,
                            exam: value as prevPaperType["exam"],
                          },
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["midsem", "endsem", "quiz", "others"].map((type) => (
                          <SelectItem value={type} key={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id={`prevPaper-${index}-year`}
                      name={`prevPaper-${index}-year`}
                      placeholder="Year"
                      variant="fluid"
                      value={prevPaper.link}
                      onChange={(e) => {
                        handlePrevPaperAction(ACTION_TYPES.UPDATE_PREV_PAPER, {
                          index,
                          prevPaper: {
                            ...prevPaper,
                            link: e.currentTarget.value,
                          },
                        });
                      }}
                    />
                    <Button
                      size="icon"
                      variant="destructive_light"
                      onClick={() => {
                        handlePrevPaperAction(ACTION_TYPES.REMOVE_PREV_PAPER, {
                          index,
                        });
                      }}
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button onClick={() => {}} className="max-w-xs" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Previous Paper
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          size="lg"
          className="w-full max-w-md mx-auto"
          onClick={() => {
            toast.promise(saveCourse(state), {
              loading: "Creating Course",
              success: () => {
                dispatch({ type: ACTION_TYPES.RESET_COURSE });
                return "Course Created";
              },
              error: "Failed to create course",
            });
          }}
        >
          <Send className="mr-2 h-5 w-5" />
          Create Course
        </Button>
      </CardFooter>
    </>
  );
}
