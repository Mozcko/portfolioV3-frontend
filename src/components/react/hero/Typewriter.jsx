import React, { useState, useEffect } from "react";

/**
 * @param {{ words: string[], textClass?: string, cursorClass?: string, style?: object }} props
 */
const Typewriter = ({ words = [], textClass = "", cursorClass = "", style = {} }) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    if (words.length === 0) return;

    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      const nextText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(nextText);

      let nextSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && nextText === fullText) {
        nextSpeed = 1500;
        setIsDeleting(true);
      } else if (isDeleting && nextText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        nextSpeed = 500;
      }

      setTypingSpeed(nextSpeed);
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed]);

  return (
    <span className={textClass} style={style}>
      {text}
      <span className={`${cursorClass} animate-pulse`}>_</span>
    </span>
  );
};

export default Typewriter;