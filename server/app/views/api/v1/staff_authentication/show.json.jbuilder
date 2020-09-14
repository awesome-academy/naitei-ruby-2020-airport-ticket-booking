json.success true
json.data @current_staff.attributes.except "encrypted_password", "created_at", "updated_at", "reset_password_token",
                                           "reset_password_sent_at", "remember_created_at"
