import styles from '../ActividadesPage.module.css';

interface Props {
  images: string[];
  onClick: () => void;
}

export function MediaGrid({ images, onClick }: Props) {
  if (!images || images.length === 0) return null;

  const count = images.length;
  const displayImages = images.slice(0, 4); 
  const remaining = count - 4;

  const gridClass = 
    count === 1 ? styles.grid1 :
    count === 2 ? styles.grid2 :
    count === 3 ? styles.grid3 :
    styles.grid4;

  return (
    <div className={`${styles.mediaGridContainer} ${gridClass}`} onClick={onClick}>
      {displayImages.map((img, index) => {
        if (index === 3 && remaining > 0) {
          return (
            <div key={index} className={styles.imageWrapper}>
              <img src={img} alt={`Foto ${index}`} className={styles.gridImage} />
              <div className={styles.moreOverlay}>
                <span>+{remaining}</span>
              </div>
            </div>
          );
        }
        return (
          <div key={index} className={styles.imageWrapper}>
            <img src={img} alt={`Foto ${index}`} className={styles.gridImage} />
          </div>
        );
      })}
    </div>
  );
}