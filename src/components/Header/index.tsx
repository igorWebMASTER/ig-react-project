import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  // TODO
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <nav>
          <Link href="/">
            <a>
              <img src="/Logo.svg" alt="logo" />
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
