FactoryBot.define do
  factory :staff do
    user_name{"staff#{rand(1..100)}"}
    email{"#{user_name}@system.com"}
    password{Settings.test.default_password}
  end

  trait :is_admin do
    is_admin{true}
  end

  trait :is_staff do
    is_admin{false}
  end
end
