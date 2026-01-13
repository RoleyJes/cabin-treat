import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import { DarkModeProvider } from "../context/DarkModeCotext";
import { useDarkMode } from "../context/useDarkMode";

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ButtonIcon
      onClick={toggleDarkMode}
      title={isDarkMode ? "light mode" : "dark mode"}
    >
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;
