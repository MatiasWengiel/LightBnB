SELECT properties.id, title, cost_per_night, avg(rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE properties.city LIKE '%ancouv%'
GROUP BY properties.id
HAVING avg(rating) >= 4
LIMIT 10;
