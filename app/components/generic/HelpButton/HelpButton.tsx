import React, { useMemo } from "react";
import { helpBtnColorScheme } from "@/app/theme/colorSchemes";

interface IHelpButtonProbs {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isAlgoRunning?: boolean;
  className?: string;
}

const HelpButton: React.FC<IHelpButtonProbs> = ({
  text,
  onClick,
  isAlgoRunning,
  className,
}) => {
  const btnColorScheme = useMemo(
    () => (isAlgoRunning ? "disabled" : "normal"),
    [isAlgoRunning]
  );

  const btnClasses = useMemo(() => {
    const scheme = helpBtnColorScheme[btnColorScheme];
    return `
      border
      rounded-full
      border-white
      w-[24px]
      h-[24px]
      p-0
      pt-0.5
      flex
      justify-center
      align-center
      slt:text-center
      font-bold
      hover:text-white
      text-sm
      4k:w-[45px]
      4k:h-[45px]
      4k:text-lg
      ${scheme.focusRing}
      ${scheme.hover}
      ${scheme.cursor}
    `;
  }, [btnColorScheme])

  return (
    <>
      <button
        className={`${btnClasses} ${className ? className : " "}`}
        onClick={onClick}
        disabled={isAlgoRunning}
      >
        {text}
      </button>
    </>
  );
};

export default HelpButton;
