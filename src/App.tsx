import React from 'react';
import logo from './logo.svg';
import styles from './App.css';
// import Header from './components/Header'
console.log(styles)

function App() {
  return (
    <div className={styles.App}>
      {/* <Header name="typescript" color="#333" /> */}
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className={styles.link}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
