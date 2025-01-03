from typing import Dict

class ParticipantRemover:
    def __init__(self, participants_repository) -> None:
        self.__participants_repository = participants_repository

    def remove(self, trip_id, email) -> Dict:
        try:
            self.__participants_repository.remove_participant(trip_id, email)
            return {
                "body": None,
                "status_code": 204
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }