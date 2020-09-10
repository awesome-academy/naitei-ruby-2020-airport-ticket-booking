Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :customers do
        resources :flights, only: :create
        resources :bookings, only: %i(index create)
        scope :bookings do
          get "/search", to: "search_bookings#index"
        end
      end

      post "/signup", to: "customers#create"

      resources :customers, only: :update

      scope :auth do
        post "/login", to: "customer_authentication#create"
        get "/me", to: "customer_authentication#show"
      end

      namespace :staffs do
        post "/login", to: "authentication#create"
        get "/info", to: "authentication#show"
        resources :flights, except: %i(new edit show)
        resources :planes, only: %i(index show)
      end
    end
  end

  devise_for :customers
  devise_for :staffs
end
