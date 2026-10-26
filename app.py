import atexit
import json
import os
from pathlib import Path

from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder='.')
BACKUP_OPPORTUNITIES = Path(__file__).resolve().parent / 'opportunities_back.json'


@app.route('/health')
def health_check():
    return jsonify({"status": "ok"})


@app.route('/opportunities.json')
def serve_opportunities_json():
    if BACKUP_OPPORTUNITIES.exists():
        return send_from_directory(app.static_folder, 'opportunities_back.json')
    return jsonify({"error": "No backup opportunities file available"}), 404


@app.route('/refresh')
@app.route('/reload-opportunities')
@app.route('/reload-opportunities-json', methods=['GET', 'POST'])
def refresh_now():
    return jsonify({"status": "ok", "message": "Using opportunities_back.json; daily generation disabled."})


@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/admin')
def serve_admin():
    return send_from_directory(app.static_folder, 'admin.html')


@app.route('/<path:filename>')
def serve_static(filename):
    safe_path = os.path.normpath(filename)
    if safe_path.startswith('..'):
        return "Invalid path", 400

    if os.path.exists(os.path.join(app.static_folder, safe_path)):
        return send_from_directory(app.static_folder, safe_path)

    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
