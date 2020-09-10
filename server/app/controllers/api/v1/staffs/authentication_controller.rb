class Api::V1::Staffs::AuthenticationController < ApiController
  before_action :authenticate_staff!, only: :show

  def create
    staff = Staff.find_by email: params[:email]
    if staff&.valid_password? params[:password]
      valid_token = JsonWebToken.encode staff_id: staff.id, is_admin: staff.is_admin
      render json: {success: true, token: valid_token}, status: :ok
    elsif staff.nil?
      render json: {success: false, message: I18n.t("staffs.not_found")}, status: :not_found
    else
      render json: {success: false, message: I18n.t("staffs.incorrect_password")}, status: :bad_request
    end
  end

  def show
    @current_staff = current_staff
    render :show
  end
end
