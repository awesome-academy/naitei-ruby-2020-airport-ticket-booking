class Api::V1::AuthenticationController < ApiController
  before_action :authenticate_token!, only: :show

  def create
    customer = Customer.find_by email: params[:email]
    if customer&.authenticate params[:password]
      valid_token = JsonWebToken.encode id: customer.id
      render json: {success: true, token: valid_token}, status: :ok
    elsif customer.nil?
      render json: {success: false, message: I18n.t("customers.not_found")}, status: :not_found
    else
      render json: {success: false, message: I18n.t("customers.incorrect_password")}, status: :bad_request
    end
  end

  def show
    render :show
  end
end