class Api::V1::CustomerAuthenticationController < ApiController
  before_action :authenticate_customer!, only: :show

  def create
    customer = Customer.find_by email: params[:email]
    if customer&.valid_password? params[:password]
      valid_token = JsonWebToken.encode customer_id: customer.id
      render json: {success: true, token: valid_token}, status: :ok
    elsif customer.nil?
      render json: {success: false, message: I18n.t("customers.not_found")}, status: :not_found
    else
      render json: {success: false, message: I18n.t("customers.incorrect_password")}, status: :bad_request
    end
  end

  def show
    @current_customer = current_customer
    render :show
  end
end
