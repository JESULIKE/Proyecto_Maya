from flask import Flask, jsonify
import os
import requests

app = Flask(__name__)

@app.route('/reload')
def reload_webapp():
    username = os.environ.get('PYTHONANYWHERE_USER', 'edutlasdeveloper')
    token = os.environ.get('PYTHONANYWHERE_TOKEN')
    if not token:
        return jsonify({'error': 'PYTHONANYWHERE_TOKEN environment variable not set'}), 500
    domain = f'{username}.pythonanywhere.com'

    response = requests.post(
        f'https://www.pythonanywhere.com/api/v0/user/{username}/webapps/{domain}/reload/',
        headers={'Authorization': f'Token {token}'}
    )

    if response.status_code == 200:
        return jsonify({'message': 'App recargada correctamente'}), 200
    else:
        return jsonify({'error': response.text}), response.status_code