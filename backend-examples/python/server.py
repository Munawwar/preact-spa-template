import json
import os
from flask import Flask, send_from_directory, request, Response
from werkzeug.middleware.shared_data import SharedDataMiddleware

from preact_iso_url_pattern import preact_iso_url_pattern_match

app = Flask(__name__)

# Constants
is_production = os.environ.get('FLASK_ENV') == 'production'
PORT = int(os.environ.get('PORT', 5173))
public_url_path = '/public'


root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

with open(os.path.join(root, 'dist/routes.json'), 'r') as f:
    client_side_managed_routes = json.load(f)

with open(os.path.join(root, 'dist/.vite/manifest.json'), 'r') as f:
    vite_prod_manifest = json.load(f)

# Serve static files
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    public_url_path: os.path.join(root, 'dist')
})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    try:
        with open(os.path.join(root, 'dist/index.html'), 'r') as f:
            template = f.read()

        matching_route = next(
          (route for route in client_side_managed_routes 
            if preact_iso_url_pattern_match(request.path, route['path'])
          ), 
          None
        )

        title = matching_route.get('title', '') if matching_route else ''
        entry_file_name = matching_route.get('Component', '') if matching_route else ''

        manifest_entry = vite_prod_manifest.get(entry_file_name, {})
        preload_js = [f"{public_url_path}/{file}" for file in 
                      (manifest_entry.get('imports', []) + [manifest_entry.get('file')])
                      if file and not file.endswith('.html')]
        preload_css = [f"{public_url_path}/{file}" for file in manifest_entry.get('css', [])]

        head_content = '\n'.join([
            f"<title>{title}</title>" if title else '',
            *[f'<link rel="modulepreload" crossorigin href="{js}">' for js in preload_js],
            *[f'<link rel="stylesheet" crossorigin href="{css}">' for css in preload_css]
        ])

        html = template.replace('<!-- ssr-head-placeholder -->', head_content)

        return Response(html, mimetype='text/html')

    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(host='localhost', port=PORT, debug=not is_production)
