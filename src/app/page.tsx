import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h2>
          Hello, for api docs see{" "}
          <a href="https://github.com/anshour/simple-blog-api/blob/main/README.md">here</a>
        </h2>
      </div>
    </main>
  );
}
