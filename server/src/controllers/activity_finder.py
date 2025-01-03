from typing import Dict
from datetime import datetime, timedelta

class ActivityFinder:
    def __init__(self, activities_repository, trips_repository) -> None:
        self.__activities_repository = activities_repository
        self.__trips_repository = trips_repository
    
    def find_activities_from_trip(self, trip_id) -> Dict:
        try:
            activities = self.__activities_repository.find_activities_from_trip(trip_id)
            trip = self.__trips_repository.find_trip_by_id(trip_id)
            
            start_date = datetime.strptime(trip[2], "%Y-%m-%dT%H:%M:%S.%fZ")
            end_date = datetime.strptime(trip[3], "%Y-%m-%dT%H:%M:%S.%fZ")
            difference_in_days = (end_date - start_date).days

            formatted_activities = []

            for i in range(difference_in_days + 1):
                current_date = (start_date + timedelta(days=i))

                activities_infos = [
                    {
                        "id": activity[0],
                        "title": activity[1],
                        "occurs_at": activity[2],
                    }
                    for activity in activities
                    if activity[2].split('T')[0] == current_date.strftime("%Y-%m-%d")
                ]

                formatted_activities.append({
                    "date": current_date,
                    "activities": activities_infos,
                })

            return {
                "body": { "activities": formatted_activities },
                "status_code": 200
            }
        except Exception as exception:
            return {
                "body": { "error": "Bad Request", "message": str(exception) },
                "status_code": 400
            }
