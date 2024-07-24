from src.main.server.server import app

from src.models.settings.db_connection_handler import db_connection_handler

from src.main.server.config import PORT

if __name__ == "__main__":
    db_connection_handler.connect()
    
    app.run(host='0.0.0.0', port=PORT, debug=True)