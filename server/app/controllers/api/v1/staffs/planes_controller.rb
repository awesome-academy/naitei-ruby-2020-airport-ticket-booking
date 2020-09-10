class Api::V1::Staffs::PlanesController < ApiController
  before_action :authenticate_staff!
  before_action :find_plane, only: :show

  def index
    @planes = Plane.all
    render json: {success: true, data: @planes, count: @planes.size}, status: :ok
  end

  def show
    render json: {success: true, data: @plane}, status: :ok
  end

  private

  def find_plane
    @plane = Plane.find_by id: params[:id]
    return if @plane

    render json: {success: false, message: I18n.t("planes.not_found")}, status: :not_found
  end
end
