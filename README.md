<div align="center">
  <img src="https://raw.githubusercontent.com/Sanjeet990/JSON-Orbit/refs/heads/main/public/json.svg" alt="JSON Orbit Logo" width="120" height="120">
  
  # JSON Orbit
  
  *A modern, all-in-one JSON explorer with TOON conversion support*
</div>

## About JSON Orbit

**JSON Orbit** is a modern, all-in-one JSON explorer that allows you to view, analyze, and visualize data in an easy way. It features a rich viewer, graph-based JSON map, JSON↔TOON converter, and a clean, dark-themed interface in a lightweight, Docker-ready application.

Designed from scratch to be the smart and fast successor of classic JSON utilities, JSON Orbit is one of the early adopters of **TOON** — a compact, human-readable encoding of the JSON data model optimized for LLM prompts.

**Live Demo**: [https://app.jsonorbit.com/](https://app.jsonorbit.com/)  
**Website**: [https://jsonorbit.com/](https://jsonorbit.com/)

## Features

- **Rich JSON Viewer**: Interactive and intuitive visualization of complex JSON structures
- **Graph-based JSON Map**: Visual node-based representation to explore data relationships
- **JSON↔TOON Converter**: Seamless conversion between JSON and TOON formats with real-time updates
- **Dual Editors**: Dedicated editors for both JSON and TOON with syntax highlighting and auto-formatting
- **Real-time Validation**: Instant feedback on syntax errors to ensure data integrity
- **Dark/Light Themed Interface**: Beautiful, clean UI with both light and dark mode
- **Property Table**: Detailed property inspector for deep data exploration
- **Lightweight & Fast**: Optimized performance with minimal dependencies
- **Docker-Ready**: Easy deployment with included Docker configuration with optional SSL support

## Getting Started

### 1. Quick Start with npx (Easiest)

The fastest way to try JSON Orbit without any installation:

```bash
npx jsonorbit
```

This will start the application locally and open it in your browser.

### 2. Local Development

To set up a development environment:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sanjeet990/JSON-Orbit.git
   cd JSON-Orbit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### 3. Docker Deployment

#### Option A: Using Docker Hub Image (Recommended)

The easiest way to run JSON Orbit using the pre-built Docker image:

```bash
docker run -d --name jsonorbit --restart unless-stopped \
  -v "./certs:/certs" \
  -p 9696:80 \
  -p 9697:443 \
  -e NODE_ENV=production \
  sanjeet990/jsonorbit:latest
```

Then open your browser to `http://localhost:9696` (or `https://localhost:9697` if SSL is configured).

**Docker Hub**: [https://hub.docker.com/r/sanjeet990/jsonorbit](https://hub.docker.com/r/sanjeet990/jsonorbit)

#### Option B: Build Your Own Docker Image

If you prefer to build the Docker image locally from the repository:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sanjeet990/JSON-Orbit.git
   cd JSON-Orbit
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t jsonorbit .
   ```

3. **Run the container**:
   ```bash
   docker run -d --name jsonorbit --restart unless-stopped \
     -v "./certs:/certs" \
     -p 9696:80 \
     -p 9697:443 \
     -e NODE_ENV=production \
     jsonorbit
   ```

### SSL/HTTPS Configuration

JSON Orbit supports optional SSL/HTTPS. To enable SSL:

1. **Create a certs directory** in your host machine with your SSL certificates:
   ```
   certs/
   ├── server-crt.pem    (Your SSL certificate)
   └── server-key.pem    (Your SSL private key - no passphrase)
   ```

2. **Mount the certificates volume** when running the container:
   ```bash
   docker run -d --name jsonorbit --restart unless-stopped \
     -v "./certs:/certs" \
     -p 9696:80 \
     -p 9697:443 \
     sanjeet990/jsonorbit:latest
   ```

The server will automatically detect the certificates and enable HTTPS on port 443, with HTTP on port 80 redirecting to HTTPS.

**Without SSL**: Simply run the container without the `-v "./certs:/certs"` volume mount and skip the `-p 9697:443` port mapping. The server will run in standard HTTP mode.

## Technical Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Container**: Docker with Nginx
- **Package Manager**: npm

## Browser Support

JSON Orbit works on all modern browsers:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## About TOON Format

TOON is a compact, human-readable encoding of the JSON data model designed for use in LLM prompts. JSON Orbit is one of the early adopters of this format, providing seamless conversion between JSON and TOON.

**Learn more about TOON**: [https://toonformat.dev/](https://toonformat.dev/)

## Contributing

Contributions are welcome! Please feel free to submit issues, fork the repository, and create pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support & Contact

- **Developer Portfolio**: [https://sanjeetpathak.com/](https://sanjeetpathak.com/)
- **Buy Me A Coffee**: [https://buymeacoffee.com/sanjeet990](https://buymeacoffee.com/sanjeet990)
- **Email**: [hello@sanjeetpathak.com](mailto:hello@sanjeetpathak.com)
- **GitHub**: [https://github.com/Sanjeet990](https://github.com/Sanjeet990)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://sanjeetpathak.com/">Sanjeet Pathak</a></p>
</div>
