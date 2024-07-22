import uuid
import pytest

from .participants_repository import ParticipantsRepository
from src.models.settings.db_connection_handler import db_connection_handler

db_connection_handler.connect()

trip_id = str(uuid.uuid4())

# @pytest.mark.skip(reason="interação com banco")
def test_registry_participants():
    conn = db_connection_handler.get_connection()
    participant_repository = ParticipantsRepository(conn)

    participant_infos = {
        "id": str(uuid.uuid4()),
        "trip_id": trip_id,
        "emails_to_invite_id": "teste@teste.com",
        "name": "Teste",
    }

    participant_repository.registry_participants(participant_infos)

