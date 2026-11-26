import { useEffect, useState } from "react";
import { getCourses } from "../services/api";

function useCourseData(category, level, keyword, sortBy) {
  const [attempt, setAttempt] = useState(0);

  const requestKey = JSON.stringify([
    category,
    level,
    keyword,
    sortBy,
    attempt,
  ]);

  const [result, setResult] = useState({
    requestKey: null,
    courses: [],
    error: "",
  });

  useEffect(function () {
    const controller = new AbortController();

    async function loadCourses() {
      try {
        const courses = await getCourses(
          {
            category: category,
            level: level,
            keyword: keyword,
            sortBy: sortBy,
          },
          controller.signal
        );

        if (controller.signal.aborted) {
          return;
        }

        setResult({
          requestKey: requestKey,
          courses: courses,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          requestKey: requestKey,
          courses: [],
          error: error.message || "Impossible de charger les cours.",
        });
      }
    }

    loadCourses();

    return function () {
      controller.abort();
    };
  }, [category, level, keyword, sortBy, requestKey]);

  function reload() {
    setAttempt(function (currentAttempt) {
      return currentAttempt + 1;
    });
  }

  const isLoading = result.requestKey !== requestKey;

  let courses = [];
  let error = "";

  if (!isLoading) {
    courses = result.courses;
    error = result.error;
  }

  return {
    courses: courses,
    error: error,
    isLoading: isLoading,
    reload: reload,
  };
}

export default useCourseData;