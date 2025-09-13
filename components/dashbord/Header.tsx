import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  username: string;
  onMenuClick: () => void;
}

export default function Header({ username, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <button
        onClick={onMenuClick}
        className="md:hidden text-blue-600 focus:outline-none"
      >
        <MenuIcon fontSize="large" />
      </button>

      <h2 className="text-xl font-semibold text-blue-600">Welcome 👋</h2>
    </header>
  );
}
