from typing import Dict

class ParticipantsFinder:
    def __init__(self, participants_repository) -> None:
        self.__participants_repository = participants_repository
    
    def find_participants_from_trip(self, trip_id: str) -> Dict:
        try:
            participants = self.__participants_repository.find_participants_from_trip(trip_id)

            participants_infos = []

            for participant in participants:
                participants_infos.append({
                    "id": participant[0],
                    "name": participant[1],
                    "email": participant[3],
                    "is_confirmed": participant[2],
                })

            return {
                "body": { "participants": participants_infos },
                "status_code": 200
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }
