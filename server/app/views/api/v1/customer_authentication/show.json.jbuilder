json.success true
json.data @current_customer.attributes.except "encrypted_password", "created_at", "updated_at", "reset_password_token",
                                              "reset_password_sent_at", "remember_created_at"
