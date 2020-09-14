class Api::V1::Staffs::PlanesController < ApiController
  before_action :authenticate_staff!
  before_action :find_plane, only: :show
  before_action :get_planes, only: :index

  def index
    render json: {success: true, data: @planes, count: @planes.size}, status: :ok
  end

  def show
    render json: {success: true, data: @plane}, status: :ok
  end

  private

  def get_planes
    @planes = Plane.all.order_by_name.map do |plane|
      plane.attributes.merge normal_seat_number: plane.normal_seat_number,
                             business_seat_number: plane.business_seat_number
    end
  end

  def find_plane
    @plane = Plane.find_by id: params[:id]
    @plane = @plane.attributes.merge normal_seat_number: @plane.normal_seat_number,
                                     business_seat_number: @plane.business_seat_number
    return if @plane

    render json: {success: false, message: I18n.t("planes.not_found")}, status: :not_found
  end
end
