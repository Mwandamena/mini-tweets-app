import Container from "../../common/Container";
import Logo from "./Logo";
import Links from "./Links";

export default function Navbar() {
  return (
    <nav className="py-3 fixed top-0 right-0 w-full h-[74px] bg-white dark:bg-secondary/30 border-b border-veryLightGray dark:border-b-gray-800/80 dark:shadow-none z-[999] dark:backdrop-blur-md">
      <Container>
        <div className="w-full flex items-center justify-between dark:text-white">
          {/* logo */}
          <Logo />

          {/* navlinks */}
          <Links />
        </div>
      </Container>
    </nav>
  );
}
