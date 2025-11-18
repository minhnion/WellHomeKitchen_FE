import { v4 as uuidv4 } from "uuid";

const generateAnonymousId = () => {
  const newAnonymousId = uuidv4();
  return newAnonymousId;
};

const setAnonymousId = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return generateAnonymousId();
  }
  let anonymousId = localStorage.getItem("anonymousId");
  if (!anonymousId || anonymousId === "undefined") {
    anonymousId = generateAnonymousId();
    localStorage.setItem("anonymousId", anonymousId);
  }
  return anonymousId;
};

const getAnonymousId = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return generateAnonymousId();
  }
  let anonymousId = localStorage.getItem("anonymousId");
  if (!anonymousId || anonymousId === "undefined") {
    anonymousId = setAnonymousId();
  }
  return anonymousId;
};

export { setAnonymousId, getAnonymousId };
