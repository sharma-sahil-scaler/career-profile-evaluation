# CPE Sahil - Local Development Setup

## Quick Start

### First Time Setup (Build + Start)
```bash
docker-compose up --build -d
```

### Daily Development (No Rebuilds)
```bash
docker-compose up -d
```

### Live Code Reloading (Watch Mode)
```bash
docker-compose watch
```

**This is your new best friend!** ✨

When using `watch` mode:
- Changes to `backend/src/**` auto-sync to container
- Changes to `frontend/src/**` auto-sync to container  
- Python: Changes take effect immediately (uvicorn auto-reload)
- React: Changes auto-build and reload

No `--build` flag needed. No container restarts needed. Just save and refresh!

---

## Common Tasks

### View Logs
```bash
docker-compose logs -f backend   # Backend logs
docker-compose logs -f frontend  # Frontend logs
docker-compose logs -f           # All logs
```

### Clear Cache (when testing personas)
```bash
psql -U sudhanvaacharya -d profile_cache -c "DELETE FROM response_cache;"
```

### Rebuild One Service (if you change Dockerfile)
```bash
docker-compose up --build backend -d
```

### Full Restart
```bash
docker-compose down
docker-compose up -d
```

---

## Development Workflow

### Best Practice for Feature Development:

1. **Start watch mode** (one terminal):
   ```bash
   docker-compose watch
   ```

2. **Edit code** (another terminal):
   ```bash
   # Edit files in backend/src or frontend/src
   # Changes auto-sync!
   ```

3. **Test in browser**:
   - Backend: http://localhost:8000/career-profile-tool/api/health
   - Frontend: http://localhost/career-profile-tool/

4. **Hard refresh browser** (Cmd+Shift+R) to see React changes

---

## Persona Testing

After code changes, you can test personas without rebuilds:

```bash
# Clear cache first
psql -U sudhanvaacharya -d profile_cache -c "DELETE FROM response_cache;"

# Test a specific persona (faster than full local testing)
python3 test_personas_comprehensive.py 7  # Non-Tech-Bootcamp

# Test all 12 personas
python3 test_personas_comprehensive.py all
```

---

## Example Iteration

You're in watch mode, and want to:
1. Add a new persona
2. Update job recommendations
3. Test it

```bash
# Terminal 1: Start watch mode
docker-compose watch

# Terminal 2: Edit personas.json
vim backend/src/config/personas.json  # Make changes, save

# Terminal 3: Test the changes (no rebuild needed!)
psql -U sudhanvaacharya -d profile_cache -c "DELETE FROM response_cache;"
python3 test_personas_comprehensive.py 7
```

✨ That's it! Changes are live, no rebuild required.

