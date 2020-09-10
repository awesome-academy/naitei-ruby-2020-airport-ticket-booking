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

  scope :search_by_day, ->(dates){where departure_day: dates}
  scope :search_by_route, ->(flight_routes){where flight_route_id: flight_routes}
  scope :order_by_departure_day, ->{order departure_day: :asc}
end
