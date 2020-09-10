require "rails_helper"

RSpec.describe "API V1 Customers Flights", type: :request do
  describe "POST /api/v1/customers/flights" do
    let(:first_flight){FactoryBot.create :flight, :hn_hcm_route, departure_day: "2020/09/10"}
    let(:second_flight){FactoryBot.create :flight, :hcm_hn_route, departure_day: "2020/09/20"}

    context "with valid parameters" do

      let(:valid_params) do {
        "flight" => {
          "flight_type" => 2,
          "time" => {
            "first" => first_flight.departure_day.strftime("%Y/%m/%d"),
            "second" => second_flight.departure_day.strftime("%Y/%m/%d")
          },
          "locations" => {
            "from" => first_flight.flight_route.departure.location.sub_name,
            "to" => second_flight.flight_route.departure.location.sub_name
          }
        }
      }
      end

      before{post "/api/v1/customers/flights", params: valid_params, as: :json}

      it "should return success status" do
        expect_status 200
      end

      it "should return valid json types" do
        expect_json_types("data", flight_type: :int, first: {flights: :array_of_objects, count: :int}, second: {flights: :array_of_objects, count: :int})
      end
    end

    context "with invalid parameters" do

      let(:invalid_params) do {
        "flight" => {
          "flight_type" => 3,
          "time" => {
            "first" => first_flight.departure_day.strftime("%Y/%m/%d"),
            "second" => second_flight.departure_day.strftime("%Y/%m/%d")
          },
          "locations" => {
            "from" => first_flight.flight_route.departure.location.sub_name,
            "to" => second_flight.flight_route.departure.location.sub_name
          }
        }
      }
      end

      before{post "/api/v1/customers/flights", params: invalid_params, as: :json}

      it "should return not found status" do
        expect_status 404
      end

      it "should return valid json types" do
        expect_json(success: false, message: "Invalid flight type!!")
      end
    end
  end
end
