module Api::V1::Concerns
  module FlightsResponse
    include Api::V1::Concerns::Response

    extend ActiveSupport::Concern

    def flight_info_params
      params.require(:flight).permit Flight::BOOKING_FLIGHTS_PARAMS
    end

    def search_one_way_flight
      SearchOneWayFlightService.new(flight_info_params).perform
    end

    def search_round_trip_flight
      SearchRoundTripFlightService.new(flight_info_params).perform
    end

    def render_response condition
      if condition
        render :create, status: :ok
      else
        render json: {success: false, message: I18n.t("flights.not_found")}, status: :not_found
      end
    end

    def is_one_way_flights_available?
      @flights.size.positive?
    end

    def is_round_trip_flights_available?
      @first_flights&.size&.positive? && @second_flights&.size&.positive?
    end
  end
end
