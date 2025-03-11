import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #7b2cbf; /* Purple theme */
    --secondary-color: #ff7706;
    --text-color: #333;
    --background-color: #f2e6fe;
    
    color-scheme: light dark;
    color: var(--text-color);
    background-color: var(--background-color);
    
    font-family: "SF Pro Display", sans-serif;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, button, input, textarea, select {
    font-family: "SF Pro Display", sans-serif !important;
  }

  body {
    font-size: 16px;
    line-height: 1.6;
  }

  /* Override Material-UI Typography */
  .MuiTypography-root {
    font-family: "SF Pro Display", sans-serif !important;
  }

  /* Override Material-UI Button */
  .MuiButton-root {
    font-family: "SF Pro Display", sans-serif !important;
  }
`;

export default GlobalStyles;
