import os
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder='.')


@app.route('/health')
def health_check():
    return jsonify({"status": "ok"})


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
