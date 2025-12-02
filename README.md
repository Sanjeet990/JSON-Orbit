# JSON Viewer

A comprehensive tool for visualizing, editing, and converting JSON and TOON data formats. This application provides a user-friendly interface to work with structured data, offering multiple visualization modes and real-time validation.

## Features

-   **Multi-Format Support**: Seamlessly switch between JSON and TOON (YAML-like) formats.
-   **Visualizers**:
    -   **Tree Viewer**: Interactive tree view of your data for easy navigation.
    -   **Map View**: Graphical node-based representation to visualize relationships.
-   **Editors**: Dedicated editors for JSON and TOON with syntax highlighting and formatting.
-   **Real-time Validation**: Instant feedback on syntax errors to ensure data integrity.
-   **Auto-Conversion**: Automatic conversion between JSON and TOON formats as you switch tabs.
-   **Dark Mode**: Built-in light and dark themes to suit your preference.

## Getting Started

To run the application locally:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

3.  **Open in browser**:
    Navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Docker

You can also build and run the application using Docker:

1.  **Build the Docker image**:
    ```bash
    docker build -t jsonviewer .
    ```

2.  **Run the container**:
    ```bash
    docker run -d -p 8080:80 jsonviewer
    ```

3.  **Access the application**:
    Open your browser and navigate to `http://localhost:8080`.
