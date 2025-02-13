import React, { useMemo } from "react";

interface ISimpleButtonProbs {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isAlgoRunning?: boolean;
}

const SimpleButton: React.FC<ISimpleButtonProbs> = ({ text, onClick, isAlgoRunning }) => {
const btnColorScheme = useMemo(
    () => (isAlgoRunning ? "disabled" : "normal"),
    [isAlgoRunning]
  );

  const colorSchemes = {
    normal: {
        hover: "hover:text-teal-600"
    },
    disabled: {
        hover: "hover:text-red-600"
    }
  }

  const btnClasses = useMemo(() => {
    const scheme = colorSchemes[btnColorScheme];

    return `
    4k:text-3xl
    bg-transparent
    border-transparent
    text-white
    ${scheme.hover}
    `
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnColorScheme])

  return (
    <>
      <button
        className={btnClasses}
        onClick={onClick}
        disabled={isAlgoRunning}
      >
        {text}
      </button>
    </>
  );
};

export default SimpleButton;
