import uuid
from typing import Dict
from datetime import datetime
import locale

from src.drivers.email_sender import send_email
from src.templates.email import email_template

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

            trip_id = str(uuid.uuid4())
            trip_infos = { **body, "id": trip_id }

            self.__trip_repository.create_trip(trip_infos)

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
                    self.__participants_repository.registry_participants({
                        "name": None,
                        "email": email,
                        "is_confirmed": 0,
                        "is_owner": 0,
                        "trip_id": trip_id,
                        "id": str(uuid.uuid4())
                    })

            destination = body.get("destination")
            starts_at = body.get("starts_at")
            ends_at = body.get("ends_at")

            locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')
            start_date = datetime.fromisoformat(starts_at.replace("Z", "+00:00"))
            end_date = datetime.fromisoformat(ends_at.replace("Z", "+00:00"))

            displayedDate = f"{start_date.strftime('%d')} a {end_date.strftime('%d')} de {end_date.strftime('%B')} de {end_date.strftime('%Y')}"

            send_email(
                [body["owner_email"]],
                email_template(trip_id, destination, displayedDate, WEB_PORT)
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
