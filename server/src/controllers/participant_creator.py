import uuid
from typing import Dict
from datetime import datetime
import locale

from src.drivers.email_sender import send_email
from src.templates.email import email_confirm_participant
from src.main.server.config import WEB_PORT

class ParticipantCreator:
    def __init__(self, participants_repository, trip_repository) -> None:
        self.__participants_repository = participants_repository
        self.__trip_repository = trip_repository

    def create(self, body, trip_id) -> Dict:
        try:
            participant_id = str(uuid.uuid4())

            participant_infos = {
                "id": participant_id,
                "trip_id": trip_id,
                "name": body["name"],
                "email": body["email"],
                "is_confirmed": body["is_confirmed"],
                "is_owner": body["is_owner"],
            }

            self.__participants_repository.registry_participants(participant_infos)

            trip = self.__trip_repository.find_trip_by_id(trip_id)
            locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')
            starts_at = datetime.fromisoformat(trip[2].replace("Z", "+00:00"))
            ends_at = datetime.fromisoformat(trip[3].replace("Z", "+00:00"))
            
            displayedDate = f"{starts_at.strftime('%d')} a {ends_at.strftime('%d')} de {ends_at.strftime('%B')} de {ends_at.strftime('%Y')}"

            send_email(
                [body["email"]],
                "Confirmação de Presença!",
                email_confirm_participant(trip_id, participant_id, trip[1], displayedDate, WEB_PORT)
            )

            return {
                "body": { "participant_id": participant_id },
                "status_code": 201
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }