from sqlite3 import Connection
from typing import Dict, Tuple

class TripsRepository:
    def __init__(self, conn: Connection) -> None:
        self.__conn = conn

    def create_trip(self, trip_infos: Dict) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                INSERT INTO trips
                    (id, destination, starts_at, ends_at)
                VALUES
                    (?, ?, ?, ?)
            ''', (
                trip_infos["id"],
                trip_infos["destination"],
                trip_infos["starts_at"],
                trip_infos["ends_at"],
            )
        )
        self.__conn.commit()

    def find_trip_by_id(self, trip_id: str) -> Tuple:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''SELECT * FROM trips WHERE id = ?''', (trip_id,)
        )
        trip = cursor.fetchone()
        return trip

    def update_trip_status(self, trip_id: str) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            ''' 
                UPDATE trips
                    SET is_confirmed = 1
                WHERE
                    id = ?
            ''', (trip_id,)
        )
        self.__conn.commit()

    def update_trip(self, trip_id: str, trip_infos: Dict) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            ''' 
                UPDATE trips
                    SET 
                        destination = ?,
                        starts_at = ?,
                        ends_at = ?
                WHERE
                    id = ?
            ''', (
                trip_infos["destination"],
                trip_infos["starts_at"],
                trip_infos["ends_at"], 
                trip_id,)
        )
        self.__conn.commit()