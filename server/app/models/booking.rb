class Booking < ApplicationRecord
  BOOKINGS_PARAMS = [:booking_total,
                     :total_price,
                     :payment_method_id,
                     :customer_id,
                     :flight_type,
                     flight_details: [first: [:flight_id, :seat_type_id],
                                      second: [:flight_id, :seat_type_id]],
                     booking_user: [:name, :email, :phone],
                     booking_details: [:booking_name, :booking_dob, :booking_nation, service_ids: []]].freeze

  has_and_belongs_to_many :services
  belongs_to :customer, optional: true
  belongs_to :booking_status
  belongs_to :payment_method
  belongs_to :seat_type
  belongs_to :flight

  validates :booking_name, presence: true
  validates :booking_dob, presence: true
  validates :booking_nation, presence: true
  validates :total_price, presence: true,
            numericality: {greater_than: Settings.bookings.minimum_total_price}
  validates :flight_id, presence: true
  validates :booking_status_id, presence: true
  validates :payment_method_id, presence: true
  validates :seat_type_id, presence: true

  delegate :plane, :departure_day, :shift_id, to: :flight
  delegate :name, to: :seat_type, prefix: true
  delegate :name, to: :booking_status, prefix: true
  delegate :method_name, to: :payment_method

  scope :search_by_id, ->(ids){where customer_id: ids}
  scope :is_pending, ->{where booking_status: Settings.bookings.pending}
  scope :is_success, ->{where booking_status: Settings.bookings.success}

  ransack_alias :departure_location, :flight_flight_route_departure_location_sub_name
  ransack_alias :arrive_location, :flight_flight_route_arrive_location_sub_name
  ransack_alias :departure_day, :flight_departure_day
  ransack_alias :plane_id, :flight_plane_id

  before_create :increase_reserved_seat
  before_destroy :decrease_reserved_seat

  scope :order_by_departure_day, ->{joins(:flight).order departure_day: :asc}
  scope :order_by_shift, ->{joins(:flight).order shift_id: :asc}

  paginates_per Settings.pagination.per_page

  def is_normal_seat?
    seat_type_id == Settings.bookings.normal_seat
  end

  def is_business_seat?
    seat_type_id == Settings.bookings.business_seat
  end

  private

  def increase_reserved_seat
    if is_normal_seat?
      flight.update(normal_reserved_seat: flight.normal_reserved_seat + 1)
    else
      flight.update(business_reserved_seat: flight.business_reserved_seat + 1)
    end
  end

  def decrease_reserved_seat
    if is_normal_seat?
      flight.update(normal_reserved_seat: flight.normal_reserved_seat - 1)
    else
      flight.update(business_reserved_seat: flight.business_reserved_seat - 1)
    end
  end
end
