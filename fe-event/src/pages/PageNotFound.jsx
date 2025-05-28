function PageNotFound() {
  return (
    <main className="h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="bg-white border border-gray-200 rounded-md p-12 max-w-3xl text-center shadow-md">
        <h1 className="text-2xl font-semibold text-gray-700 mb-8">
          The page you are looking for could not be found 😢
        </h1>
      </div>
    </main>
  );
}

export default PageNotFound;
