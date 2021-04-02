import Link from "next/link";


import styles from './header.module.scss'

export default function Header() {
  // TODO
  return (
    <header className={styles.haeaderContainer}>
      <div className="headerContent">
        <Link href="/">
          <img src="/Logo.svg" alt="logo"/>
        </Link>
      </div>
    </header>
  )    
}
