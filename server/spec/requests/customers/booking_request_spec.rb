require "rails_helper"

RSpec.describe "API V1 Customers Bookings", type: :request do
  let!(:first_flight){FactoryBot.create :flight, :hn_hcm_route, departure_day: "2020/09/10"}
  let!(:second_flight){FactoryBot.create :flight, :hcm_hn_route, departure_day: "2020/09/20"}
  let!(:user){FactoryBot.create :customer}
  let!(:luggage_service){FactoryBot.create :service, :luggage}
  let!(:checkin_service){FactoryBot.create :service, :checkin}
  let!(:lounge_service){FactoryBot.create :service, :lounge}
  let!(:normal_seat){FactoryBot.create :seat_type, :normal}
  let!(:business_seat){FactoryBot.create :seat_type, :business}
  let!(:payment_method){FactoryBot.create :payment_method, :credit_card}
  let!(:booking_status){FactoryBot.create :booking_status, :success}

  describe "POST /api/v1/customers/bookings" do
    context "with valid parameters" do
      let(:valid_params) do {
        "booking_user" => {
          "name" => user.full_name,
          "email" => user.email,
          "phone" => user.phone
        },
        "flight_type" => 2,
        "customer_id" => user.id,
        "payment_method_id" => payment_method.id,
        "flight_details" => {
          "first" => {
            "flight_id" => first_flight.id,
            "seat_type_id" => normal_seat.id
          },
          "second" => {
            "flight_id" => second_flight.id,
            "seat_type_id" => business_seat.id
          }
        },
        "total_price" => (first_flight.base_price + second_flight.base_price * 1.5) * 2 +
                          luggage_service.fee + checkin_service.fee + lounge_service.fee,
        "booking_total" => 2,
        "booking_details" => [
          {
            "booking_name" => Faker::Name.name,
            "booking_dob" => "1999-01-01",
            "booking_nation" => Faker::Address.country,
            "service_ids" => [luggage_service.id, checkin_service.id]
          },
          {
            "booking_name" => Faker::Name.name,
            "booking_dob" => "1999-01-01",
            "booking_nation" => Faker::Address.country,
            "service_ids" => [lounge_service.id]
          }
        ]
      }
      end

      before{post "/api/v1/customers/bookings", params: valid_params, as: :json}
      
      it "should return success status" do
        expect_status 200
      end

      it "should return valid json types" do
        expect_json_types("data",
          total_price: :float,
          payment_method: :string,
          booking_user: {
            name: :string,
            email: :string,
            phone: :string
          },
          first_departure_day: :date,
          first_bookings: :array_of_objects,
          first_booking_count: :int,
          second_departure_day: :date,
          second_bookings: :array_of_objects,
          second_booking_count: :int
        )
        expect_json_types("data.first_bookings.*",
          booking_name: :string,
          booking_dob: :date,
          booking_nation: :string,
          plane_name: :string,
          total_price: :float,
          seat_number: :string,
          seat_type: :string,
          booking_status: :string
        )
        expect_json_types("data.second_bookings.*",
          booking_name: :string,
          booking_dob: :date,
          booking_nation: :string,
          plane_name: :string,
          total_price: :float,
          seat_number: :string,
          seat_type: :string,
          booking_status: :string
        )
      end
    end
    
    context "with invalid params" do
      let(:valid_params) do {
        "booking_user" => {
          "name" => user.full_name,
          "email" => user.email,
          "phone" => user.phone
        },
        "flight_type" => 2,
        "customer_id" => user.id,
        "payment_method_id" => payment_method.id,
        "flight_details" => {
          "first" => {
            "flight_id" => first_flight.id,
            "seat_type_id" => normal_seat.id
          },
          "second" => {
            "flight_id" => second_flight.id,
            "seat_type_id" => business_seat.id
          }
        },
        "total_price" => (first_flight.base_price + second_flight.base_price * 1.5) * 2 +
                          luggage_service.fee + checkin_service.fee + lounge_service.fee,
        "booking_total" => 3,
        "booking_details" => [
          {
            "booking_name" => Faker::Name.name,
            "booking_dob" => "1999-01-01",
            "booking_nation" => Faker::Address.country,
            "service_ids" => [luggage_service.id, checkin_service.id]
          },
          {
            "booking_name" => Faker::Name.name,
            "booking_dob" => "1999-01-01",
            "booking_nation" => Faker::Address.country,
            "service_ids" => [lounge_service.id]
          }
        ]
      }
      end

      it "should return bad request status" do
        expect_status 400
      end

      before{post "/api/v1/customers/bookings", params: valid_params, as: :json}

      it "should return valid json types" do
        expect_json(success: false, message: "An error occured while booking !!")
      end
    end
  end

  describe "GET /api/v1/customers/bookings" do
    let!(:valid_params) do {
      "booking_user" => {
        "name" => user.full_name,
        "email" => user.email,
        "phone" => user.phone
      },
      "flight_type" => 2,
      "customer_id" => user.id,
      "payment_method_id" => payment_method.id,
      "flight_details" => {
        "first" => {
          "flight_id" => first_flight.id,
          "seat_type_id" => normal_seat.id
        },
        "second" => {
          "flight_id" => second_flight.id,
          "seat_type_id" => business_seat.id
        }
      },
      "total_price" => (first_flight.base_price + second_flight.base_price * 1.5) * 2 +
                        luggage_service.fee + checkin_service.fee + lounge_service.fee,
      "booking_total" => 2,
      "booking_details" => [
        {
          "booking_name" => Faker::Name.name,
          "booking_dob" => "1999-01-01",
          "booking_nation" => Faker::Address.country,
          "service_ids" => [luggage_service.id, checkin_service.id]
        },
        {
          "booking_name" => Faker::Name.name,
          "booking_dob" => "1999-01-01",
          "booking_nation" => Faker::Address.country,
          "service_ids" => [lounge_service.id]
        }
      ]
    }
    end

    context "with valid token" do
      before do
        post "/api/v1/customers/bookings", params: valid_params, as: :json
        get "/api/v1/customers/bookings", headers: {Authorization: "Bearer #{JsonWebToken.encode customer_id: user.id}"}
      end

      it "should return success status" do
        expect_status 200
      end

      it "should return valid json types" do
        expect_json_types("data",
          success_bookings: {
            details: :array_of_objects,
            count: :int
          }
        )
        expect_json_types("data.success_bookings.details.*",
          booking_name: :string,
          booking_nation: :string,
          booking_dob: :date,
          plane_name: :string,
          total_price: :float,
          seat_number: :string,
          seat_type: :string
        )
      end
    end

    context "with invalid token" do
      it "should return unauthorized status" do
        post "/api/v1/customers/bookings", params: valid_params, as: :json
        get "/api/v1/customers/bookings"
        expect_status 401
      end
    end
  end
end
