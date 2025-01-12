from typing import Dict

class ActivityRemover:
    def __init__(self, activities_repository) -> None:
        self.__activities_repository = activities_repository

    def remove(self, trip_id, id) -> Dict:
        try:
            self.__activities_repository.remove_activity(trip_id, id)
            return {
                "body": None,
                "status_code": 204
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }