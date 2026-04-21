# ⚡ OpenShock Controller
 
A web-based GUI for controlling OpenShock devices — with multi-collar support, single & multi-mode shocking, and a built-in testing mode for development without physical hardware.
 
---
 
## 📋 Prerequisites
 
Before getting started, you'll need to set up the required hardware and a free OpenShock account:
 
1. Follow the [OpenShock Hardware Guide](https://wiki.openshock.org/home) to find out which hardware you need and how to flash your ESP32.
2. Create an account at [openshock.app](https://openshock.app/) and pair it with your ESP32.
3. Generate an **API key** in your account settings.
---
 
## 🚀 Setup
 
### Option 1 — Run Locally
 
1. Create a `.env` file inside the `shocker_gui` folder:
```env
VITE_OPEN_SHOCK_API_KEY="<your-api-key>"
VITE_PORT=4000
VITE_HOST='localhost'
```
 
2. Start the development server from the project root.
---
 
### Option 2 — Docker (Recommended)
 
1. Create a `.env` file in the **project root directory**:
```env
VITE_OPEN_SHOCK_API_KEY="<your-api-key>"
```
 
2. Run the container using Docker Compose.
---
 
## 🐾 Adding Collars
 
Add your collars at [openshock.app](https://openshock.app/). They will automatically appear in the user interface — no manual configuration needed.
 
---
 
## 🎮 How to Use
 
1. **Activate a collar** in the Settings and set a **maximum shock intensity**.
2. The **"Stärke"** slider on the main page represents a percentage of this maximum value.
3. In the sidebar, select between **Single Mode** or **Multi Mode**.
4. Select the people you want to shock in their respective modes.
5. Press the **⚡ button** to trigger a shock.
---
 
## 🧪 Testing Mode
 
Testing mode lets you develop and test the application **without connecting to real OpenShock devices**. All actions are simulated and logged to the console — no shocks will be delivered.
 
### Starting in Testing Mode
 
```bash
cd shocker_server
npm run dev
```
 
### What Testing Mode Does
 
| Feature | Behavior |
|---|---|
| **Server** | Creates 3 dummy test collars on startup |
| **Client** | Skips all API calls to OpenShock |
| **Client** | Prevents syncing real collars from the API |
| **Actions** | All collar control actions are logged to the console |
 
> All UI functionality remains fully intact — perfect for development without physical devices or valid API credentials.
 
---
 
## 🔗 Links
 
- 📖 [OpenShock Wiki](https://wiki.openshock.org/home)
- 🌐 [OpenShock App](https://openshock.app/)
