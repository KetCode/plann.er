from sqlite3 import Connection
from typing import Dict, List, Tuple

class ParticipantsRepository:
    def __init__(self, conn: Connection) -> None:
        self.__conn = conn

    def registry_participants(self, participant_infos: Dict) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                INSERT INTO participants
                    (id, trip_id, name, email, is_confirmed, is_owner)
                VALUES
                    (?, ?, ?, ?, ?, ?)
            ''', (
                participant_infos["id"],
                participant_infos["trip_id"],
                participant_infos["name"],
                participant_infos["email"],
                participant_infos["is_confirmed"],
                participant_infos["is_owner"],
            )
        )
        self.__conn.commit()

    def find_participants_from_trip(self, trip_id: str) -> List[Tuple]:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                SELECT p.id, p.name, p.is_confirmed, p.email, p.is_owner
                FROM participants as p
                WHERE p.trip_id = ?
            ''', (trip_id,)
        )
        participants = cursor.fetchall()
        return participants
    
    def update_participants_status(self, participant_id: str) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                UPDATE participants
                    SET is_confirmed = 1
                WHERE
                    id = ?
            ''', (participant_id,)
        )
        self.__conn.commit()

    def remove_participant(self, trip_id: str, email: str) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                DELETE FROM participants
                WHERE
                    trip_id = ?
                AND
                    email = ?
            ''', (
                trip_id, 
                email,
            )
        )
        self.__conn.commit()

    def find_participant(self, participant_id: str) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''SELECT * FROM participants WHERE id = ?''', (participant_id,)
        )
        participant = cursor.fetchone()
        return participant