import uuid
import pytest

from .links_repository import LinksRepository
from src.models.settings.db_connection_handler import db_connection_handler

db_connection_handler.connect()

trip_id = str(uuid.uuid4())

@pytest.mark.skip(reason="interação com banco")
def test_registry_link():
    conn = db_connection_handler.get_connection()
    link_repository = LinksRepository(conn)

    link_infos = {
        "id": str(uuid.uuid4()),
        "trip_id": trip_id,
        "url": "teste.com",
        "title": "Teste",
    }

    link_repository.registry_link(link_infos)

@pytest.mark.skip(reason="interação com banco")
def test_find_links_from_trip():
    conn = db_connection_handler.get_connection()
    link_repository = LinksRepository(conn)

    links = link_repository.find_links_from_trip(trip_id)
    
    assert isinstance(links, list)
    assert isinstance(links[0], tuple)