import React, { useMemo } from "react";
import { simpleBtnColorSchemes } from "@/app/theme/colorSchemes";

interface ISimpleButtonProbs {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isAlgoRunning?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const SimpleButton: React.FC<ISimpleButtonProbs> = ({
  text,
  onClick,
  isAlgoRunning,
  isDisabled,
  className,
}) => {
  const btnColorScheme = useMemo(
    () => (isAlgoRunning ? "disabled" : "normal"),
    [isAlgoRunning]
  );

  const btnClasses = useMemo(() => {
    const scheme = simpleBtnColorSchemes[btnColorScheme];

    return `
    4k:text-3xl
    bg-transparent
    border-transparent
    text-white
    text-center
    slt:text-start
    my-4
    slt:my-0
    ${scheme.hover}
    ${isDisabled ? "crossed-line pointer-events-none" : ""}
    `;
  }, [btnColorScheme, isDisabled]);

  return (
    <>
      <button
        className={`${btnClasses} ${className ? className : ""}`}
        onClick={onClick}
        disabled={isAlgoRunning}
      >
        {text}
      </button>
    </>
  );
};

export default SimpleButton;
