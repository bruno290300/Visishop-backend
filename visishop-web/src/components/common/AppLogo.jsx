import logoImage from "../../assets/applogo.png";

const SIZE_CLASSES = {
  sm: "h-20 sm:h-24",
  md: "h-25 sm:h-28",
  lg: "h-30 sm:h-34",
};

function AppLogo({ size = "md", className = "" }) {
  const logoSizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <img
      src={logoImage}
      alt="VisiShop"
      className={["w-auto object-contain", logoSizeClass, className].join(" ")}
    />
  );
}

export default AppLogo;
