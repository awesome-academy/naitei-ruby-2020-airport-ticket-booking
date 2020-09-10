class FlightMailer < ApplicationMailer
  def cancellation customer_emails, flight
    @flight = flight

    mail to: customer_emails, subject: t(".subject")
  end
end
