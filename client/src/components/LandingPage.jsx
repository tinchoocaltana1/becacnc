import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  UserCog,
  Truck,
  Users,
  Package,
  Settings,
  Mail,
  MapPin,
  ArrowDown,
} from 'lucide-react';
import logo from '../lib/images/logo.png';
import euca1 from '../lib/images/euca1.png';
import euca2 from '../lib/images/euca2.png';
import guayubira from '../lib/images/guayubira.png';
import nativas from '../lib/images/nativas.png';
import escalera from '../lib/images/escalera.png';
import mesa from  '../lib/images/mesa.png';
import mesada from '../lib/images/mesada.png';
import tabla from '../lib/images/tabla.png';
import InstagramIcon from '../components/icons/InstagramIcon';
import FacebookIcon from '../components/icons/FacebookIcon';
import { Typewriter } from 'react-simple-typewriter';
import { Link } from 'react-scroll';
import emailjs from 'emailjs-com';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  // products carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // contact form state
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  });

  useEffect(() => {
    AOS.init({ once: true }); // inicializa AOS una sola vez
  }, []);

  // products data for the carousel/swiper
  const productos = [
    {
      id: 1,
      nombre: "Eucalipto listón fino",
      descripcion: "Tablero alistonado con vetas suaves y tonalidad uniforme. Medida estándar: 1,20x3m. Disponible en 18, 20 y 30 mm de espesor.",
      imagen: euca1
    },
    {
      id: 2,
      nombre: "Multicolor",
      descripcion: "Tablero alistonado con mezcla de vetas y colores propios de especies nativas. Medida estándar: 1,20x3m. Disponible en 20 y 30 mm de espesor.",
      imagen: nativas
    },
    {
      id: 3,
      nombre: "Guayubira",
      descripcion: "Tablero alistonado con contraste natural de vetas y tonos intensos. Medida estándar: 1,20x3m. Disponible en 20 y 30 mm de espesor.",
      imagen: guayubira
    },
    {
      id: 4,
      nombre: "Eucalipto listón grueso",
      descripcion: "Tablero finger joint con listones anchos y textura homogénea. Medida estándar: 1,20x3m. Disponible en 18, 20 y 30 mm de espesor.",
      imagen: euca2
    },
  ];

  // carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + productos.length) % productos.length);
  };

  // carousel/swiper auto-slide effect
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  // form handling
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_e0ngogd', // SERVICE ID
      'template_mvssz6c', // TEMPLATE ID
      {
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        mensaje: formData.mensaje
      },
      'ALJB5ePGGUzQBY3-0' // PUBLIC KEY
    )
      .then(() => {
        alert('¡Gracias por tu consulta! Nos pondremos en contacto pronto.');
        console.log('Email enviado exitosamente: ', formData);
        setFormData({ nombre: '', telefono: '', email: '', mensaje: '' });
      })
      .catch(error => {
        console.error('Error al enviar el email:', error);
        alert('Hubo un error al enviar tu consulta. Por favor, intenta nuevamente más tarde.');
      });
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* simplified hero section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        {/* background image with overlay */}
        <div className="absolute inset-0 z-0">
          {/* change this image with your own */}
          <img
            src="https://images.unsplash.com/photo-1744500555175-a9cfec324d8f?q=80&w=1316&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Taller de madera Beca CNC"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-primary/40"></div>
        </div>

        {/* principal content */}
        <div data-aos="fade-up"  className="relative z-10 container mx-auto px-6 text-center text-white h-screen flex flex-col items-center justify-center">
          {/* logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <img src={logo} alt="Beca CNC" className="w-56" />
          </div>

          {/* principal title */}
          <div className="max-w-4xl mx-auto mb-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              Tableros listos para{" "}
              <span className="block text-secondary">
                tus{" "}
                <span className="inline-block">
                  <Typewriter
                    words={['proyectos.', 'ideas.', 'trabajos.', 'reformas.']}
                    loop
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                    deleteSpeed={100}
                    delaySpeed={1250}
                  />
                </span>
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-space">
              Vendemos tableros de madera finger alistonados, cepillados y lijados.
              Calidad garantizada para carpinteros, emprendedores, empresas y profesionales.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Link
              to="productos"
              smooth={true}
              duration={500}
              className="cursor-pointer bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Ver tableros
            </Link>
          </div>

          {/* social media */}
          <div className="flex justify-center gap-6">
            <a href="https://instagram.com/beca_cnc/" target='_blank' className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
              <InstagramIcon />
            </a>
            <Link
              to="contacto"
              smooth={true}
              duration={500}
              title='Contacto'
              className="cursor-pointer w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Phone size={24} />
            </Link>
          </div>

          {/* scroll indicator */}
          <div className="absolute bottom-8 left-50 transform -translate-x-50 animate-bounce opacity-80">
            <ArrowDown size={32} className="text-white/70" />
          </div>
        </div>
      </section>

      {/* about us section */}
      <section data-aos="fade-up" id="nosotros" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              ¿Quiénes somos?
            </h2>
            <div className="max-w-4xl mx-auto font-space">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Somos una empresa familiar ubicada en Morón, Buenos Aires.
                Nos dedicamos a la comercialización de tableros de madera de alta calidad,
                ideales para carpintería, mueblería, arquitectura y construcción.
                Trabajamos con responsabilidad, atención personalizada y precios
                muy competitivos.
              </p>
            </div>
          </div>

          {/* principal features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="text-secondary" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                Especialistas en madera
              </h3>
              <p className="text-gray-600 leading-relaxed font-space">
                Tableros alistonados de eucalipto, guayubira, multicolor y más.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="text-secondary" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                Envíos a todo el país
              </h3>
              <p className="text-gray-600 leading-relaxed font-space">
                Envíos personalizados según tu ubicación. También podés retirar por nuestro local.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-secondary" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                Atención personalizada
              </h3>
              <p className="text-gray-600 leading-relaxed font-space">
                Te ayudamos a elegir lo que necesitás y te asesoramos en cada paso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* products section (carousel/swiper) */}
      <section data-aos="fade-up" id="productos" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Nuestros tableros.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-space">
              Descubrí nuestra variada selección de tableros de madera de primera calidad.
            </p>
          </div>

          {/* carousel/swiper */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-xl shadow-2xl bg-white">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {productos.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 h-[650px] md:h-80">
                      {/* product image */}
                      <div className="relative">
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0"></div>
                      </div>

                      {/* product data */}
                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-primary mb-4">
                          {product.nombre}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6 font-space">
                          {product.descripcion}
                        </p>
                        <Link
                          to="contacto"
                          smooth={true}
                          duration={500}
                          className="cursor-pointer bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors duration-300 w-fit"
                        >
                          Consultar precio
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* carousel/swiper controls */}
            <button
              onClick={prevSlide}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicadores */}
            <div className="flex justify-center mt-6 gap-2">
              {productos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Nota para agregar más slides */}
          {/* 
            PARA AGREGAR MÁS PRODUCTOS AL CARRUSEL:
            1. Agrega un nuevo objeto al array 'productos' arriba
            2. Asegúrate de incluir: id, nombre, descripcion, imagen
            3. El carrusel se actualizará automáticamente
          */}
        </div>
      </section>

      {/* utils and aplications section */}
      <section data-aos="fade-up" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Inspirate con lo que podés crear.
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-6 font-space">
                Con nuestros tableros podes hacer muebles, estanterías, mesadas, puertas,
                escalones, decoración y más. Elegí la madera que mejor se adapte a
                tu proyecto y nosotros nos encargamos del resto.
              </p>
            </div>
          </div>

          {/* gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Reemplazar todas estas imágenes por fotos propias de proyectos realizados */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={mesa}
                alt="Escritorio"
                className="h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Escritorios</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={escalera}
                alt="Escaleras"
                className="h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Escaleras</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={mesada}
                alt="Mesada de cocina"
                className="h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Mesadas</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={tabla}
                alt="Tabla"
                className="h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Tablas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* personalized services section */}
      <section data-aos="fade-up" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Más que venta de tableros.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="text-secondary" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Ventas mayoristas y por unidad
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed font-space">
                Vendemos al por mayor y al por menor. Consultanos por precios
                especiales por cantidad.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="text-secondary" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Cortes a medida y trabajos CNC
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed font-space">
                Cortamos tus tableros a medida con escuadradora o router CNC.
                Consultanos y te lo dejamos listo para usar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* quality and trust section */}
      <section className="relative py-32 bg-primary text-white overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1745198321334-4a43eb239441?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Router CNC trabajando"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>

        <div data-aos="fade-up" className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Confianza, calidad y precio justo.
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-space">
            Nuestros clientes eligen <span className='font-medium text-secondary'>BecaCNC</span> por
            la atención, la dedicación y el excelente resultado de cada pedido.
          </p>
        </div>
      </section>

      {/* contact section */}
      <section data-aos="fade-up" id="contacto" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              ¿Tenés un proyecto en mente? Escribinos.
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-gray-600 mb-4">
                Pedinos un presupuesto o hacenos tu consulta. Te asesoramos sin compromiso.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* contact form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="nombre" className="block text-primary font-semibold mb-2">
                    Nombre completo <span className='text-secondary'>*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-300 placeholder:font-space"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-primary font-semibold mb-2">
                    Número de teléfono <span className='text-secondary'>*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-300 placeholder:font-space"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-primary font-semibold mb-2">
                  Correo electrónico <span className='text-secondary'>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-300 placeholder:font-space"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="mensaje" className="block text-primary font-semibold mb-2">
                  Mensaje <span className='text-secondary'>*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-300 resize-vertical placeholder:font-space"
                  placeholder="Contanos sobre tu proyecto o consultanos lo que necesites..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-secondary text-white py-4 rounded-lg font-semibold text-lg hover:bg-secondary/90 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Enviar consulta
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-primary text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg flex items-center justify-center w-full h-full">
                <img src={logo} alt="Beca CNC" className='w-48' />
              </div>
            </div>

            {/* contact data */}
            <div>
              <h4 className="text-xl font-bold mb-4">Contacto</h4>
              <div className="space-y-3 font-space">
                <a href="https://wa.me/1234567890" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <Phone size={20} />
                  <span>+54 9 11 7120 2955</span>
                </a>
                <a href="mailto:info@becacnc.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <Mail size={20} />
                  <span>becacncbeca@gmail.com</span>
                </a>
                <a href="https://maps.app.goo.gl/Dn36P1gR853TcmhAA" target='_BLANK' className="flex items-center gap-3 text-gray-300">
                  <MapPin size={20} />
                  <span>Solari 2742, Morón Sur, Buenos Aires</span>
                </a>
              </div>
            </div>

            {/* social media */}
            <div>
              <h4 className="text-xl font-bold mb-4">Seguinos</h4>
              <div className="flex gap-4">
                <a href="https://instagram.com/beca_cnc/" target='_blank' className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                  <InstagramIcon className="w-6 h-6 text-white" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61554696412638" target='_blank' className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                  <FacebookIcon className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* divider line */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex gap-3 justify-center text-gray-300 font-space">
              <p className='font-medium'>&copy; 2025 BecaCNC - Todos los derechos reservados.</p>
              <button onClick={() => window.location.href = '/login'}>
                <UserCog className="text-right w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
