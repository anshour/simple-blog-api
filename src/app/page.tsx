import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h2>
          Hello, for api docs see{" "}
          <a href="https://www.postman.com/maintenance-candidate-57457613/workspace/public-workspace/collection/19469946-3148bdf8-9a6b-42c8-b85a-0f430bcc3dc1?action=share&creator=19469946">
            here
          </a>
        </h2>
      </div>
    </main>
  );
}
