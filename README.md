# openshock



## setup

create .env file in shocker_gui with the following example content
```
VITE_OPEN_SHOCK_API_KEY= "your key" 
VITE_PORT=4000
VITE_HOST='your_url'
```

## Testing Mode

Testing mode allows you to develop and test the application without connecting to real OpenShock devices. When enabled, the server creates dummy collars and all collar control actions are logged to the console instead of being sent to the API.

### Starting the Server in Testing Mode

You can start the server in testing mode using one of these methods:

```bash
cd shocker_server
npm run dev
```

### What Testing Mode Does

- **Server**: Creates 3 dummy test collars on startup
- **Client**: Skips API calls to OpenShock and logs actions instead
- **Client**: Prevents syncing real collars from the API

All functionality remains the same, but no actual shocks are delivered to devices. This is perfect for development and testing without needing physical devices or API credentials.
