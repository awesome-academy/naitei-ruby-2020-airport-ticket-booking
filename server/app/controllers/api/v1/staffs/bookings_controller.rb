class Api::V1::Staffs::BookingsController < ApiController
  before_action :authenticate_staff!
  before_action :find_booking, only: :update

  def index
    query = search_params
    @bookings = Booking.all.order_by_departure_day.order_by_shift
                       .ransack(query).result(distinct: true).page params[:page]
  end

  def update
    if @booking.update update_params
      render json: {success: true, data: @booking}, status: :ok
    else
      validation_errors = @booking.errors.full_messages
      render json: {success: false, message: I18n.t("customers.unable_update"), errors: validation_errors},
              status: :bad_request
    end
  end

  private

  def update_params
    params.permit :booking_status_id
  end

  def find_booking
    @booking = Booking.find_by id: params[:id]
    return if @booking

    render json: {success: false, message: I18n.t("bookings.not_found")}, status: :not_found
  end

  def search_params
    Hash.new.tap do |q|
      q[:booking_status_name_eq] = params[:booking_status].presence
      q[:departure_location_eq] = params[:departure].presence
      q[:arrive_location_eq] = params[:arrive].presence
      q[:departure_day_eq] = params[:departure_day].presence
      q[:plane_id_eq] = params[:plane_id].presence
    end
  end
end
