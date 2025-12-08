const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl sm:text-8xl font-black text-red-600">404</h1>
        <p className="mb-6 text-lg sm:text-xl text-gray-400">Страница не найдена</p>
        <a href="/" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
          На главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
