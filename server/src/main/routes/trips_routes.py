from flask import jsonify, Blueprint, request
from flask_cors import CORS

from src.controllers.trip_creator import TripCreator
from src.controllers.trip_finder import TripFinder
from src.controllers.trip_confirmer import TripConfirmer
from src.controllers.trip_updater import TripUpdater
from src.controllers.link_creator import LinkCreator
from src.controllers.link_finder import LinkFinder
from src.controllers.participant_creator import ParticipantCreator
from src.controllers.participant_finder import ParticipantFinder
from src.controllers.participants_finder import ParticipantsFinder
from src.controllers.participant_confirmer import ParticipantConfirmer
from src.controllers.participant_remover import ParticipantRemover
from src.controllers.activity_creator import ActivityCreator
from src.controllers.activity_finder import ActivityFinder
from src.controllers.activity_remover import ActivityRemover

from src.models.repositories.trips_repository import TripsRepository
from src.models.repositories.links_repository import LinksRepository
from src.models.repositories.participants_repository import ParticipantsRepository
from src.models.repositories.activities_repository import ActivitiesRepository

from src.models.settings.db_connection_handler import db_connection_handler

trips_routes_bp = Blueprint("trip_routes", __name__)
CORS(trips_routes_bp)

@trips_routes_bp.route("/trips", methods=["POST"])
def create_trip():
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)
    participants_repository = ParticipantsRepository(conn)
    controller = TripCreator(trips_repository, participants_repository)
    
    response = controller.create(request.json)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>", methods=["GET"])
def find_trip(tripId):
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)
    controller = TripFinder(trips_repository)

    response = controller.find_trip_details(tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/confirm", methods=["PATCH"])
def confirm_trip(tripId):
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)
    controller = TripConfirmer(trips_repository)

    response = controller.confirm(tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/link", methods=["POST"])
def create_trip_link(tripId):
    conn = db_connection_handler.get_connection()
    links_repository = LinksRepository(conn)
    controller = LinkCreator(links_repository)

    response = controller.create(request.json, tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/link", methods=["GET"])
def find_trip_link(tripId):
    conn = db_connection_handler.get_connection()
    links_repository = LinksRepository(conn)
    controller = LinkFinder(links_repository)

    response = controller.find(tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/invites", methods=["POST"])
def invite_to_trip(tripId):
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)
    participants_repository = ParticipantsRepository(conn)
    controller = ParticipantCreator(participants_repository, trips_repository)

    response = controller.create(request.json, tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/activities", methods=["POST"])
def create_activity(tripId):
    conn = db_connection_handler.get_connection()
    activities_repository = ActivitiesRepository(conn)
    controller = ActivityCreator(activities_repository)

    response = controller.create(request.json, tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/participants", methods=["GET"])
def get_trip_participants(tripId):
    conn = db_connection_handler.get_connection()
    participants_repository = ParticipantsRepository(conn)
    controller = ParticipantsFinder(participants_repository)

    response = controller.find_participants_from_trip(tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/activities", methods=["GET"])
def get_trip_activities(tripId):
    conn = db_connection_handler.get_connection()
    activities_repository = ActivitiesRepository(conn)
    trips_repository = TripsRepository(conn)
    controller = ActivityFinder(activities_repository, trips_repository)

    response = controller.find_activities_from_trip(tripId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/participants/<participantId>/confirm", methods=["PUT"])
def confirm_participant(participantId):
    conn = db_connection_handler.get_connection()
    participants_repository = ParticipantsRepository(conn)
    controller = ParticipantConfirmer(participants_repository)

    response = controller.confirm(participantId, request.json,)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/update", methods=["PUT"])
def update_trip(tripId):
    conn = db_connection_handler.get_connection()
    trips_repository = TripsRepository(conn)
    controller = TripUpdater(trips_repository)

    response = controller.update(tripId, request.json)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/participants/<email>", methods=["DELETE"])
def remove_participant(tripId, email):
    conn = db_connection_handler.get_connection()
    participants_repository = ParticipantsRepository(conn)
    controller = ParticipantRemover(participants_repository)

    response = controller.remove(tripId, email)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/participants/<participantId>", methods=["GET"])
def find_participant(participantId):
    conn = db_connection_handler.get_connection()
    participants_repository = ParticipantsRepository(conn)
    controller = ParticipantFinder(participants_repository)

    response = controller.find(participantId)

    return jsonify(response["body"]), response["status_code"]

@trips_routes_bp.route("/trips/<tripId>/activities/<id>", methods=["DELETE"])
def remove_activity(tripId, id):
    conn = db_connection_handler.get_connection()
    activities_repository = ActivitiesRepository(conn)
    controller = ActivityRemover(activities_repository)

    response = controller.remove(tripId, id)

    return jsonify(response["body"]), response["status_code"]