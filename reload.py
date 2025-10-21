from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/reload')
def reload_webapp():
    username = 'edutlasdeveloper'
    token = '948d6fcd61747d31c0e5f957e1aba217c52f6076'
    domain = f'{username}.pythonanywhere.com'

    response = requests.post(
        f'https://www.pythonanywhere.com/api/v0/user/{username}/webapps/{domain}/reload/',
        headers={'Authorization': f'Token {token}'}
    )

    if response.status_code == 200:
        return jsonify({'message': 'App recargada correctamente'}), 200
    else:
        return jsonify({'error': response.text}), response.status_code