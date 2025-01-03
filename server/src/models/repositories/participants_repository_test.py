import uuid
import pytest

from .participants_repository import ParticipantsRepository
from src.models.settings.db_connection_handler import db_connection_handler

db_connection_handler.connect()

trip_id = str(uuid.uuid4())
p_id = str(uuid.uuid4())

@pytest.mark.skip(reason="interação com banco")
def test_registry_participants():
    conn = db_connection_handler.get_connection()
    participant_repository = ParticipantsRepository(conn)

    participant_infos = {
        "id": p_id,
        "trip_id": trip_id,
        "name": "Teste",
        "email": "teste@teste.com",
        "is_confirmed": 0,
        "is_owner": 0,
    }

    participant_repository.registry_participants(participant_infos)

@pytest.mark.skip(reason="interação com banco")
def test_find_participants_from_trip():
    conn = db_connection_handler.get_connection()
    participant_repository = ParticipantsRepository(conn)

    participants = participant_repository.find_participants_from_trip(trip_id)
    
    print()
    print(participants)

@pytest.mark.skip(reason="interação com banco")
def test_update_participants_status():
    conn = db_connection_handler.get_connection()
    participant_repository = ParticipantsRepository(conn)

    participant_repository.update_participants_status(p_id)