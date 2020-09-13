class Api::V1::Staffs::FlightsController < ApiController
  before_action :authenticate_staff!
  before_action :require_admin, only: %i(create update destroy)
  before_action :find_flight, only: %i(update destroy)

  def index
    if params[:page]
      query = search_params
      @flights = Flight.ransack(query).result(distinct: true)
                       .order_by_departure_day.order_by_shift.page params[:page]
      @type = "page"
    else
      @flights = Flight.order_by_departure_day
      @type = "all"
    end
    render :index, status: :ok
  end

  def create
    @flight_response = CreateFlightService.new(create_flight_info_params).perform
    if @flight_response[:success]
      render json: {success: true, data: @flight_response[:data]}, status: :ok
    else
      render json: {success: false, message: @flight_response[:message]}, status: :bad_request
    end
  end

  def update
    @customer_emails = get_customer_emails @flight.id

    if @flight.update update_flight_info_params
      FlightMailer.update(@customer_emails, @flight).deliver_now
      render json: {success: true, data: @flight}, status: :ok
    else
      validation_errors = @flight.errors.full_messages
      render json: {success: false, message: I18n.t("customers.unable_update"), errors: validation_errors},
              status: :bad_request
    end
  end

  def destroy
    @customer_emails = get_customer_emails @flight.id

    if @flight.update flight_status_id: Settings.flight_status.cancelled
      FlightMailer.cancellation(@customer_emails, @flight).deliver_now
      render json: {success: true, message: I18n.t("flights.delete_success")}, status: :ok
    else
      render json: {success: false, message: I18n.t("flights.delete_fail")}, status: :bad_request
    end
  end

  private

  def create_flight_info_params
    params.permit Flight::STAFF_CREATE_FLIGHTS_PARAMS
  end

  def update_flight_info_params
    params.permit Flight::STAFF_UPDATE_FLIGHTS_PARAMS
  end

  def find_flight
    @flight = Flight.find_by id: params[:id]
    return if @flight

    render json: {success: false, message: I18n.t("flights.not_found")}, status: :not_found
  end

  def require_admin
    raise StandardError unless current_staff.is_admin
  rescue StandardError
    render json: {success: false, message: I18n.t("staffs.forbidden")}, status: :forbidden
  end

  def get_customer_emails flight_id
    bookings = Booking.ransack({flight_id_eq: flight_id, customer_id_not_null: true}).result
    bookings.map{|b| b.customer.email}
  end

  def search_params
    Hash.new.tap do |q|
      q[:flight_status_id_eq] = params[:flight_status_id].presence
      q[:plane_id_eq] = params[:plane_id].presence
      q[:departure_day_eq] = params[:departure_day].presence
      q[:departure_location_eq] = params[:from].presence
      q[:arrive_location_eq] = params[:to].presence
    end
  end
end
