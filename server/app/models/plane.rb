class Plane < ApplicationRecord
  belongs_to :plane_type
  has_many :flights, dependent: :destroy

  delegate :name, to: :plane_type, prefix: true
  delegate :normal_seat_number, :business_seat_number, to: :plane_type

  scope :order_by_name, ->{order name: :asc}
end
