class CreateFlightService < ApplicationService
  def initialize params
    @plane_id = params[:plane_id]
    @shift_id = params[:shift_id]
    @flight_route_id = params[:flight_route_id]
    @departure_day = params[:departure_day]
  end

  attr_reader :plane_id, :shift_id, :flight_route_id, :departure_day

  def perform
    raise ArgumentError unless Time.zone.now.midnight < departure_day

    new_flight = create_new_flight
    unless new_flight.save
      return {success: false, message: I18n.t("flights.error"), errors: new_flight.errors.full_messages}
    end

    {success: true, data: new_flight}
  rescue ArgumentError
    {success: false, message: I18n.t("flights.error_departure_day")}
  end

  private

  def create_new_flight
    Flight.new({
                 departure_day: format_date(departure_day),
                 normal_reserved_seat: Settings.flights.default_seat,
                 business_reserved_seat: Settings.flights.default_seat,
                 plane_id: get_plane(plane_id),
                 flight_route_id: get_flight_route(flight_route_id),
                 shift_id: get_shift(shift_id),
                 flight_status_id: Settings.flights.default_status
               })
  end

  def get_plane id
    Plane.find_by(id: id).try(:id)
  end

  def get_flight_route id
    FlightRoute.find_by(id: id).try(:id)
  end

  def get_shift id
    Shift.find_by(id: id).try(:id)
  end
end
