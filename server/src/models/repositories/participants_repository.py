from sqlite3 import Connection
from typing import Dict, Tuple

class ParticipantsRepository:
    def __init__(self, conn: Connection) -> None:
        self.__conn = conn

    def registry_participants(self, partcipant_infos: Dict) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                INSERT INTO participants
                    (id, trip_id, emails_to_invite_id, name)
                VALUES
                    (?, ?, ?, ?)
            ''', (
                partcipant_infos["id"],
                partcipant_infos["trip_id"],
                partcipant_infos["emails_to_invite_id"],
                partcipant_infos["name"],
            )
        )
        self.__conn.commit()

    def find_participants(self, trip_id: str) -> List[Tuple]:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                SELECT p.id, p.name, p.is_confirmed, e.email
                FROM participants as p
                JOIN emails_to_invite as e ON e.id = p.emails_to_invite_id
                WHERE p.trip_id = ?
            ''', (trip_id)
        )
        participants = cursor.fetchall()
        return participants
    
    