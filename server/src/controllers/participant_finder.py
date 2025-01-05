from typing import Dict

class ParticipantFinder:
    def __init__(self, participants_repository) -> None:
        self.__participants_repository = participants_repository
    
    def find(self, participant_id: str) -> Dict:
        try:
            participant = self.__participants_repository.find_participant(participant_id)

            if not participant: raise Exception("No Participant Found")

            return {
                "body": {
                    "participant": {
                        "id": participant[0],
                        "name": participant[1],
                        "email": participant[2],
                        "is_confirmed": participant[3],
                        "is_owner": participant[4],
                        "trip_id": participant[5]
                    }
                },
                "status_code": 200
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }
