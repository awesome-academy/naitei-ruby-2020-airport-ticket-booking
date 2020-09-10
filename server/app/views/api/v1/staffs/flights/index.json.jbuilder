# json.data json.partial! "shared/pagination", collection: @flights
json.success true
if @type == "all"
  json.data @flights
elsif @type == "page"
  json.data do
    json.details @flights
    json.partial! "api/v1/shared/pagination", collection: @flights
  end
end
