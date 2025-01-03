from typing import Dict

class TripUpdater:
    def __init__(self, trips_repository) -> None:
        self.__trips_repository = trips_repository

    def update(self, trip_id, trips_infos) -> Dict:
        try:
            self.__trips_repository.update_trip(trip_id, trips_infos)
            return { "body": None, "status_code": 204}
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }
