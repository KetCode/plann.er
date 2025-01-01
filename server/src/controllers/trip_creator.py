import uuid
from typing import Dict

from src.drivers.email_sender import send_email
from src.templates.email import email_template

from src.main.server.config import PORT

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

            send_email(
                [body["owner_email"]],
                email_template(trip_id, PORT)
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
