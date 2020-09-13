class Flight < ApplicationRecord
  BOOKING_FLIGHTS_PARAMS = [:flight_type, time: [:first, :second], locations: [:from, :to]].freeze
  STAFF_CREATE_FLIGHTS_PARAMS = [:plane_id, :shift_id, :flight_route_id, :departure_day].freeze
  STAFF_UPDATE_FLIGHTS_PARAMS = [:plane_id, :shift_id, :flight_route_id, :departure_day, :normal_reserved_seat,
                                :business_reserved_seat].freeze

  belongs_to :plane
  belongs_to :flight_route
  belongs_to :shift
  belongs_to :flight_status
  has_many :bookings, dependent: :destroy

  delegate :name, to: :plane, prefix: true
  delegate :name, to: :shift, prefix: true
  delegate :name, to: :flight_status, prefix: true
  delegate :plane_type_name, :normal_seat_number, :business_seat_number, to: :plane
  delegate :departure_time, to: :shift
  delegate :base_price, :flight_duration, to: :flight_route

  ransack_alias :departure_location, :flight_route_departure_location_sub_name
  ransack_alias :arrive_location, :flight_route_arrive_location_sub_name

  scope :search_by_day, ->(dates){where departure_day: dates}
  scope :search_by_route, ->(flight_routes){where flight_route_id: flight_routes}
  scope :order_by_departure_day, ->{order departure_day: :asc}
  scope :order_by_shift, ->{order shift_id: :asc}

  paginates_per Settings.pagination.per_page

  before_update :set_booking_status, if: :flight_status_id_changed?

  private

  def set_booking_status
    return unless flight_status_id == Settings.flight_status.cancelled

    bookings.each do |booking|
      booking.update booking_status_id: Settings.booking_status.cancelled
    end
  end
end
