import uuid
from typing import Dict
from datetime import datetime
import locale

from src.drivers.email_sender import send_email
from src.templates.email import email_confirm_trip
from src.templates.email import email_confirm_participant

from src.main.server.config import WEB_PORT

class TripCreator:
    def __init__(self, trip_repository, participants_repository) -> None:
        self.__trip_repository = trip_repository
        self.__participants_repository = participants_repository

    def create(self, body) -> Dict:
        try:
            emails = body.get("emails_to_invite")
            owner_name = body.get("owner_name")
            owner_email = body.get("owner_email")
            destination = body.get("destination")

            trip_id = str(uuid.uuid4())
            trip_infos = { **body, "id": trip_id }

            self.__trip_repository.create_trip(trip_infos)

            locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')
            starts_at = datetime.fromisoformat(body["starts_at"].replace("Z", "+00:00"))
            ends_at = datetime.fromisoformat(body["ends_at"].replace("Z", "+00:00"))

            displayedDate = f"{starts_at.strftime('%d')} a {ends_at.strftime('%d')} de {ends_at.strftime('%B')} de {ends_at.strftime('%Y')}"

            if owner_name:
                self.__participants_repository.registry_participants({
                    "name": owner_name,
                    "email": owner_email,
                    "is_confirmed": 1,
                    "is_owner": 1,
                    "trip_id": trip_id,
                    "id": str(uuid.uuid4()),
                })

            if emails:
                for email in emails:
                    participant_id = str(uuid.uuid4())

                    self.__participants_repository.registry_participants({
                        "name": None,
                        "email": email,
                        "is_confirmed": 0,
                        "is_owner": 0,
                        "trip_id": trip_id,
                        "id": participant_id
                    })
                    
                    send_email(
                        [email],
                        "Confirmação de Presença!",
                        email_confirm_participant(participant_id, destination, displayedDate, WEB_PORT)
                    )

            send_email(
                [body["owner_email"]],
                "Confirmação de Viagem!",
                email_confirm_trip(trip_id, destination, displayedDate, WEB_PORT)
            )

            return {
                "body": {"tripId": trip_id},
                "status_code": 201
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }
