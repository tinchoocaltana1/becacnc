import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [failed, setFailed] = useState(false);

  // form handling
  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data Submitted:", loginData);
    
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        username: loginData.username,
        password: loginData.password
      });
      console.log("Login successful:", await response.data);
      localStorage.setItem("token", await response.data.token);
      window.location.href = "/admin";
    } catch (error) {
      console.error("Login failed:", error);
      setFailed(true);
      setTimeout(() => {
        setFailed(false);
      }, 3000);
    }

    setLoginData({
      username: "",
      password: ""
    });
  }

  return (
    <section id="login" className="w-full h-screen flex justify-center items-center bg-gray-50 font-poppins">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary">
            Iniciar sesión
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className={`bg-white rounded-xl shadow-lg p-8 ${failed ? 'pb-2' : 'pb-0'} transition-all duration-300`}>
            <label htmlFor="nombre" className="block text-primary font-semibold mb-2 font-space">
              Nombre de usuario <span className='text-secondary'>*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              required
              className={`font-space w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 ${failed ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-gray-300 focus:ring-primary/50 focus:border-primary'} transition-colors duration-300 placeholder:font-space`}
              placeholder="Nombre de usuario"
            />

            <label htmlFor="email" className="block text-primary font-semibold mb-2 font-space">
              Contraseña <span className='text-secondary'>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              required
              className={`font-space w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 ${failed ? 'border-red-300 focus:ring-red-400/50 focus:border-red-400' : 'border-gray-300 focus:ring-primary/50 focus:border-primary'} transition-colors duration-300 placeholder:font-space`}
              placeholder="*******"
            />

            <button
              type="submit"
              className="w-full bg-secondary text-white py-4 rounded-lg font-semibold text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Ingresar
            </button>
            <p className={`text-center mt-2 text-red-500 transition-all duration-300 font-space select-none ${failed ? 'opacity-100' : 'opacity-0'}`}>
                Credenciales inválidas.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;