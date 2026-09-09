import styles from "./demo.module.css";

type Props = {
  rows?: number;
};

export function PlaylistDialogSkeleton({ rows = 5 }: Props) {
  return (
    <div className={styles.dialogSkeleton} aria-hidden="true">
      <div className={styles.dialogSkeletonHead}>
        <div className={`${styles.skeletonBlock} ${styles.dialogSkeletonThumb}`} />
        <div className={styles.dialogSkeletonCopy}>
          <div className={`${styles.skeletonBlock} ${styles.dialogSkeletonTitle}`} />
          <div className={`${styles.skeletonBlock} ${styles.dialogSkeletonMeta}`} />
        </div>
      </div>

      <ul className={styles.videoList}>
        {Array.from({ length: rows }).map((_, index) => (
          <li key={index} className={styles.videoSkeletonItem}>
            <div className={`${styles.skeletonBlock} ${styles.videoSkeletonThumb}`} />
            <div className={styles.videoSkeletonCopy}>
              <div className={`${styles.skeletonBlock} ${styles.videoSkeletonLine}`} />
              <div className={`${styles.skeletonBlock} ${styles.videoSkeletonLineShort}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
