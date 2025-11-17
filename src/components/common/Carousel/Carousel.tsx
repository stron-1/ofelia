import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// 2. Importa los estilos base de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 3. Importa tus estilos CSS Module
import styles from './Carousel.module.css';

// 4. Importa tus imágenes (Vite las manejará)
import img1 from '../../../assets/images/InicioFotos_1.jpg';
import img2 from '../../../assets/images/InicioFotos_2.jpg';
import img3 from '../../../assets/images/InicioFotos_3.jpg';
import img4 from '../../../assets/images/InicioFotos_4.jpg';
import img5 from '../../../assets/images/InicioFotos_5.jpg';

// Creamos un array con las imágenes para mapearlas
const images = [img1, img2, img3, img4, img5];

export function Carousel() {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        // 5. Registra los módulos
        modules={[Navigation, Pagination, Autoplay]}
        // Configuración
        spaceBetween={30}        // Espacio entre slides
        slidesPerView={1}        // Mostrar 1 slide a la vez
        navigation={true}          // Habilita flechas de navegación
        pagination={{ clickable: true }} // Habilita puntos de paginación
        loop={true}                // Para que sea un bucle infinito
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
      >
        {/* 6. Mapeamos las imágenes a los Slides */}
        {images.map((imgSrc, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <img
              src={imgSrc}
              alt={`Foto de la institución ${index + 1}`}
              className={styles.slideImg}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}