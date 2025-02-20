import React, { useMemo } from "react";

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
  className
}) => {
  const btnColorScheme = useMemo(
    () => (isAlgoRunning ? "disabled" : "normal"),
    [isAlgoRunning]
  );

  const colorSchemes = {
    normal: {
      hover: "hover:text-teal-600",
    },
    disabled: {
      hover: "hover:text-red-600",
    },
  };

  const btnClasses = useMemo(() => {
    const scheme = colorSchemes[btnColorScheme];

    return `
    4k:text-3xl
    bg-transparent
    border-transparent
    text-white
    text-center
    slt:text-start
    ${scheme.hover}
    ${isDisabled ? "crossed-line pointer-events-none" : ""}
    `;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnColorScheme, isDisabled]);

  return (
    <>
      <button className={`${btnClasses} ${className}`} onClick={onClick} disabled={isAlgoRunning}>
        {text}
      </button>
    </>
  );
};

export default SimpleButton;
