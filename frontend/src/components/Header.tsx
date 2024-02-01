interface HeaderProps {
  onSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Header: React.FC<HeaderProps> = ({ onSearchInputChange }) => {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-indigo-500 px-4 py-5 uppercase sm:px-6 ">
      <h1>Logo</h1>
      <input
        onChange={onSearchInputChange}
        className="rounded-full bg-zinc-100 px-4 py-2 text-lg placeholder-zinc-600 transition-all duration-300 focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-opacity-50 sm:w-64 sm:focus:w-72"
        placeholder="Search Users..."
      />
    </header>
  );
};

export default Header;
