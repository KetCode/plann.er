import uuid
import pytest

from datetime import datetime, timedelta
from .trips_repository import TripsRepository
from src.models.settings.db_connection_handler import db_connection_handler

db_connection_handler.connect()

trip_id = str(uuid.uuid4())

@pytest.mark.skip(reason="interação com banco")
def test_create_trip():
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)

    trips_infos = {
        "id": trip_id,
        "destination": "Recife",
        "starts_at": datetime.strptime("02-01-2023", "%d-%m-%Y"),
        "ends_at": datetime.strptime("02-01-2023", "%d-%m-%Y") + timedelta(days=5),
        "owner_name": "Kesse",
        "owner_email": "kesse@email.com",
        "emails_to_invite": ["kesse@teste.com", "teste@teste.com", "tamara@teste.com"],
    }

    trips_repository.create_trip(trips_infos)

@pytest.mark.skip(reason="interação com banco")
def test_find_trip_by_id():
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)

    trip = trips_repository.find_trip_by_id(trip_id)

@pytest.mark.skip(reason="interação com banco")
def test_update_trip_status():
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)

    trips_repository.update_trip_status(trip_id)