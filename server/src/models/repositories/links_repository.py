from sqlite3 import Connection
from typing import Dict, Tuple, List

class LinksRepository:
    def __init__(self, conn: Connection) -> None:
        self.__conn = conn

    def registry_link(self, link_infos: Dict) -> None:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''
                INSERT INTO links
                    (id, url, title, trip_id)
                VALUES
                    (?, ?, ?, ?)
            ''', (
                link_infos["id"],
                link_infos["url"],
                link_infos["title"],
                link_infos["trip_id"],
            )
        )
        self.__conn.commit()

    def find_links_from_trip(self, trip_id: str) -> List[Tuple]:
        cursor = self.__conn.cursor()
        cursor.execute(
            '''SELECT * FROM links WHERE trip_id = ?''', (trip_id,)
        )
        links = cursor.fetchall()
        return links