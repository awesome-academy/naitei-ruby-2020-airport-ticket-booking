Staff.create(user_name: "staff1",
  email: "staff1@system.com",
  password: "123456",
  is_admin: true)

Staff.create(user_name: "staff2",
  email: "staff2@system.com",
  password: "123456",
  is_admin: false)

Customer.create(full_name: "Nhat Quang",
  email: "quangdvn@gmail.com",
  password: "123456",
  phone: "0977860499",
  age: 20,
  address: "Ha Noi, Viet Nam")

49.times do |n|
  full_name = Faker::Name.name
  email = "test#{n + 1}@gmail.com"
  phone = "09778604#{n}"
  age = rand(18..30)
  address = "#{Faker::Address.city}, #{Faker::Address.country}"
  Customer.create!(full_name: full_name,
  email: email,
  password: "123456",
  phone: phone,
  age: age,
  address: address)
end

PaymentMethod.create(method_name: "Cash")

PaymentMethod.create(method_name: "Credit Card")

Location.create(name: "Ha Noi",
  sub_name: "HAN")

Location.create(name: "Da Nang",
  sub_name: "DAN")

Location.create(name: "Ho Chi Minh City",
  sub_name: "HCM")

Airport.create(name: "Noi Bai Airport",
  location_id: 1)

Airport.create(name: "Da Nang Airport",
  location_id: 2)

Airport.create(name: "Tan Son Nhat Airport",
  location_id: 3)

PlaneType.create(name: "Airbus A320",
  normal_seat_number: 100,
  business_seat_number: 100)

PlaneType.create(name: "Airbus A330",
  normal_seat_number: 90,
  business_seat_number: 90)

PlaneType.create(name: "Airbus A340",
  normal_seat_number: 80,
  business_seat_number: 80)

PlaneType.create(name: "Boeing 737",
  normal_seat_number: 150,
  business_seat_number: 150)

PlaneType.create(name: "Boeing 747",
  normal_seat_number: 125,
  business_seat_number: 125)

PlaneType.create(name: "Boeing 757",
  normal_seat_number: 75,
  business_seat_number: 75)

100.times do
  plane_recognition = rand(100..999)
  first_letter = ("A".."Z").to_a.sample
  second_letter = ("A".."Z").to_a.sample
  name = "VN-#{first_letter}#{second_letter}-#{plane_recognition}"
  plane_type_id = rand(1..6)
  Plane.create!(name: name,
  plane_type_id: plane_type_id)
end

Shift.create(name: "Morning",
  departure_time: 7)

Shift.create(name: "Noon",
  departure_time: 14)

Shift.create(name: "Night",
  departure_time: 21)

FlightRoute.create(flight_duration: 2.5,
  base_price: 55,
  departure_id: 1,
  arrive_id: 3)

FlightRoute.create(flight_duration: 2.5,
  base_price: 55,
  departure_id: 3,
  arrive_id: 1)

FlightRoute.create(flight_duration: 1.2,
  base_price: 45,
  departure_id: 3,
  arrive_id: 2)

FlightRoute.create(flight_duration: 1.2,
  base_price: 45,
  departure_id: 2,
  arrive_id: 3)

FlightRoute.create(flight_duration: 1.5,
  base_price: 50,
  departure_id: 1,
  arrive_id: 2)

FlightRoute.create(flight_duration: 1.5,
  base_price: 50,
  departure_id: 2,
  arrive_id: 1)

FlightStatus.create(name: "Undepart")

FlightStatus.create(name: "Flying")

FlightStatus.create(name: "Arrived")

def rand_seat_reserved plane_id
  max_seat = Plane.find(plane_id).plane_type.normal_seat_number
  case max_seat
  when 100
    rand(10..100)
  when 90
    rand(10..90)
  when 80
    rand(10..80)
  when 150
    rand(10..150)
  when 125
    rand(10..125)
  when 75
    rand(10..75)
  end
end

1000.times do
  departure_time = rand(3.months).seconds.from_now
  departure_day = Date.parse(departure_time.to_s)
  plane_id = rand(1..100)
  normal_reserved_seat = rand_seat_reserved(plane_id)
  business_reserved_seat = rand_seat_reserved(plane_id)
  flight_route_id = rand(1..6)
  shift_id = rand(1..3)

  Flight.create!(departure_day: departure_day,
    plane_id: plane_id,
    normal_reserved_seat: normal_reserved_seat,
    business_reserved_seat: business_reserved_seat,
    shift_id: shift_id,
    flight_status_id: 1,
    flight_route_id: flight_route_id)
end

Service.create(name: "Extra Luggage",
  fee: 4.5)

Service.create(name: "Priority Check-in",
  fee: 5)

Service.create(name: "Business Lounge",
  fee: 15.15)

SeatType.create(name: "Normal Seat",
  price_rate: 1.0)

SeatType.create(name: "Business Seat",
  price_rate: 1.5)

BookingStatus.create(name: "Pending")

BookingStatus.create(name: "Success")

def rand_booking_customer
  booking_customer = rand(1..2)
  case booking_customer
  when 1
    rand(1..50)
  end
end

def rand_seat_number flight_id, seat_type_id
  if seat_type_id == 1
    reserved_seat = Flight.find_by(id: flight_id).normal_reserved_seat
    seat_number = rand(1..reserved_seat)
    if seat_number < 10
      "A00#{seat_number}"
    elsif 9 < seat_number && seat_number < 100
      "A0#{seat_number}"
    else
      "A#{seat_number}"
    end
  else
    reserved_seat = Flight.find_by(id: flight_id).business_reserved_seat
    seat_number = rand(1..reserved_seat)
    if seat_number < 10
      "B00#{seat_number}"
    elsif seat_number > 9 && seat_number < 100
      "B0#{seat_number}"
    else
      "B#{seat_number}"
    end
  end
end

def count_total_price flight_id, seat_type_id
  base_price = Flight.find_by(id: flight_id).flight_route.base_price
  price_rate = SeatType.find_by(id: seat_type_id).price_rate
  base_price * price_rate
end

500.times do
  customer_id = rand_booking_customer
  if customer_id
    customer = Customer.find_by id: customer_id
    booking_name = customer.full_name
  else
    booking_name = Faker::Name.name
  end
  booking_nation = Faker::Address.country
  booking_dob = rand(50.years).seconds.ago.in_time_zone.to_s
  seat_type_id = rand(1..2)
  flight_id = rand(1..500)
  seat_number = rand_seat_number flight_id, seat_type_id
  total_price = count_total_price flight_id, seat_type_id
  payment_method_id = rand(1..2)
  booking_status_id = payment_method_id == 1 ? rand(1..2) : 2

  Booking.create!(customer_id: customer_id,
    booking_name: booking_name,
    booking_dob: booking_dob,
    booking_nation: booking_nation,
    flight_id: flight_id,
    seat_type_id: seat_type_id,
    seat_number: seat_number,
    total_price: total_price,
    payment_method_id: payment_method_id,
    booking_status_id: booking_status_id)
end
