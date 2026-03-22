# How To Run

## 1. PromptGenerator.jsx
The single-file React component has been wrapped in a Vite application so it can be viewed in the browser.

### Prerequisites:
- Node.js (v18+ recommended)
- npm or yarn

### Steps to run:
1. Open a terminal in this directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at the URL provided in the terminal (usually `http://localhost:5173`).

---

## 2. extract-signatures.groovy
This Groovy script is designed to run **inside IntelliJ IDEA** as a Scratch File, because it uses IntelliJ's internal PSI APIs (`com.intellij.psi.*`) to parse Java source code accurately.

### Prerequisites:
- IntelliJ IDEA open with your target Java project.

### Steps to run:
1. Open IntelliJ IDEA.
2. Go to **File > New > Scratch File**, and select **Groovy**.
3. Copy the contents of `extract-signatures.groovy` into this new scratch file.
4. Modify the `TARGET_CLASSES` array at the top of the file to include the fully-qualified class names from your project that you want to extract methods from.
5. Click the green **Run** button at the top of the scratch file editor (or right-click and select "Run 'scratch'").
6. The output will be printed to the IntelliJ console and automatically copied to your clipboard.

*Note: A `pom.xml` has been provided which includes the `groovy-all` dependency as requested. However, because the script strictly relies on IntelliJ's runtime environment for its PSI parsing capabilities, running it purely via command-line Maven (`mvn groovy:execute`) will result in missing `com.intellij` package errors.*
