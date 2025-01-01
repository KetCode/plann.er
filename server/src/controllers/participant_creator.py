import uuid
from typing import Dict

class ParticipantCreator:
    def __init__(self, participants_repository) -> None:
        self.__participants_repository = participants_repository

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

            return {
                "body": { "participant_id": participant_id },
                "status_code": 201
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }