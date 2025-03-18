# Setup

```sh
# Install  uv (Linux, Mac)
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv --python=3.13
uv pip install -r requirements.txt
```

# Run server

```sh
uv run server.py
# or
# FLASK_ENV=production uv run server.py
```
