require "rails_helper"

RSpec.describe "API V1 Staffs Flights", type: :request do
  let!(:first_flight){FactoryBot.create :flight, :hn_hcm_route, departure_day: "2020/09/10"}
  let!(:second_flight){FactoryBot.create :flight, :hcm_hn_route, departure_day: "2020/09/20"}
  let!(:staff){FactoryBot.create :staff, :is_staff}
  let!(:admin){FactoryBot.create :staff, :is_admin}

  describe "GET /api/v1/staffs/flights" do
    context "with valid token" do
      before do
        get "/api/v1/staffs/flights", headers: {Authorization: "Bearer #{JsonWebToken.encode staff_id: staff.id}"}
      end

      it "should return success status" do
        expect_status 200
      end

      it "should return valid json types" do
        expect_json_types(success: :boolean, data: :array_of_objects)
      end
    end

    context "with invalid token" do
      before do
        get "/api/v1/staffs/flights", headers: {Authorization: "Bearer #{JsonWebToken.encode customer_id: staff.id}"}
      end

      it "should return unauthorized status" do
        expect_status 401
      end
    end
  end
end
