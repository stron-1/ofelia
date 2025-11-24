import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './Carousel.module.css';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  width?: string;
  height?: string;
}

// CAMBIO AQUÍ: Usamos 'export function' en lugar de 'default' para corregir el error de importación
export function Carousel({ 
  images, 
  autoPlay = true, 
  width = '100%', 
  height = '100%' 
}: CarouselProps) {

  if (!images || images.length === 0) {
    return <div className={styles.emptyState}>No hay imágenes disponibles</div>;
  }

  return (
    <div className={styles.carouselContainer} style={{ width, height }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        loop={images.length > 1}
        autoplay={autoPlay ? {
          delay: 4000,
          disableOnInteraction: false,
        } : false}
        style={{ width: '100%', height: '100%' }}
      >
        {images.map((imgSrc, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <img
              src={imgSrc}
              alt={`Slide ${index + 1}`}
              className={styles.slideImg}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}