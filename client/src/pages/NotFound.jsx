
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-4">¡Oops! Página no encontrada</p>
        <a href="/" className="text-secondary hover:text-secondary/80 underline font-semibold">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
