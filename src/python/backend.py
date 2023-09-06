from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins='http://localhost:3000')

# Keep track of connected clients (optional but useful for broadcasting data)
connected_clients = set()

# Handle WebSocket connections (same as before)
@socketio.on('connect')
def on_connect():
    print('New client connected')
    connected_clients.add(request.sid)

@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')
    connected_clients.remove(request.sid)

# Modify the WebSocket server code to emit data updates
def emit_preference_update(data):
    try:
        emit('preference-update', data, broadcast=True, namespace='/')  # Use '/' namespace for the default namespace
    except Exception as e:
        print(f"Error in emit_data_update: {e}")

# Modify the WebSocket server code to emit data updates
def emit_data_update(data):
    try:
        emit('data-update', data, broadcast=True, namespace='/')  # Use '/' namespace for the default namespace
    except Exception as e:
        print(f"Error in emit_data_update: {e}")

# Create an API endpoint to receive data from Postman
@app.route('/data', methods=['POST'])
def submit_data():
    try:
        data = request.get_json()
        emit_data_update(data)
        return jsonify({'message': 'Data submitted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create an API endpoint to receive data from Postman
@app.route('/prefer', methods=['POST'])
def submit_preference():
    try:
        data = request.get_json()
        emit_preference_update(data)
        return jsonify({'message': 'Preferences data submitted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    socketio.run(app, debug=True)
