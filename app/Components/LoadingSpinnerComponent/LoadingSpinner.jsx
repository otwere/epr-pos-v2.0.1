const LoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white bg-opacity-90 fixed top-0 left-0 z-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold text-blue-600">Loading, please wait...</p>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  