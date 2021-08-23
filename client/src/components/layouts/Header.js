const Header = () => {
  return (
    <header className="px-3 py-2 rounded-b-lg bg-gray-200 shadow">
      <div className="flex justify-between">
        <h1 className="text-md text-xl text-blue-700 font-bold">
          Youtube-converter
        </h1>
        <div className="text-xs opacity-60 text-opacity-70 mt-2">v2.1.1</div>
      </div>
    </header>
  );
};

export default Header;
