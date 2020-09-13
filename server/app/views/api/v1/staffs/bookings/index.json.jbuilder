json.success true
json.data do
  json.details @bookings do |booking|
    json.partial! "booking", booking: booking
  end
  json.partial! "api/v1/shared/pagination", collection: @bookings
end
