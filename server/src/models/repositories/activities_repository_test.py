import uuid
import pytest

from datetime import datetime

from .activities_repository import ActivitiesRepository
from src.models.settings.db_connection_handler import db_connection_handler

db_connection_handler.connect()

trip_id = str(uuid.uuid4())

@pytest.mark.skip(reason="interação com banco")
def test_registry_activity():
    conn = db_connection_handler.get_connection()
    activities_repository = ActivitiesRepository(conn)

    activity_infos = {
        "id": str(uuid.uuid4()),
        "trip_id": trip_id,
        "title": "Activity Test",
        "occurs_at": datetime.strptime("02-01-2023", "%d-%m-%Y"),
    }

    activities_repository.registry_activity(activity_infos)

