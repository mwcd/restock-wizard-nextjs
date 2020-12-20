import styles from '../styles/Home.module.css'

export default function Header() {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <h1 className={styles.headerText}>
                    <a href="/">Restock Wizard</a>
                </h1>
            </header>
        </div>
    )
}