import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Typography, Image, Spin, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import './PackagePage.css'; // If you prefer using a separate CSS file for custom styles

const { Title, Text } = Typography;

const PackagePage = () => {
  const { packageId } = useParams();
  console.log(packageId);  // Get packageId from the URL
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch package data from API using packageId from the URL
    fetch(`http://localhost:3000/api/packages/get-package-by-id/${packageId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the response to see the structure
        setPackageData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching package data:', error);
        setLoading(false);
      });
  }, [packageId]); // Re-fetch data when packageId changes

  if (loading) {
    return <Spin size="large" style={{ marginTop: '20px' }} />;
  }

  if (!packageData || !packageData.package) {
    return <Text>No package data available</Text>;
  }

  const pkg = packageData.package; // Access the "package" key directly from the response

  return (
    <div className="package-page">
      <Title level={2} style={{ textAlign: 'center' }}>Package Details</Title>
      <Row gutter={[16, 16]} justify="center">
        {/* Main package card */}
        <Col xs={24} sm={12} md={8} lg={6} key={pkg.package_id}>
          <Card
            hoverable
            cover={<Image alt={pkg.country_name} src={pkg.country_picture} />}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            <Title level={4}>{pkg.country_name}</Title>
            <Text><strong>Guide:</strong> {pkg.guide_name}</Text>
            <Text> | <strong>Per Day Charge:</strong> ${pkg.per_day_charge}</Text>
            <br />
            <Text><strong>Total Price:</strong> ${pkg.total_price}</Text>
            <br />
            <Text><strong>Duration:</strong> {pkg.total_days_stayed} days</Text>
            <br />
            <Text><strong>People:</strong> {pkg.num_people}</Text>

            {/* Divider for styling */}
            <Divider />

            {/* Cities and Locations */}
            <div className="cities">
              {pkg.cities.map((city) => (
                <div key={city.package_city_id} className="city">
                  <Image
                    alt={city.city_name}
                    src={city.city_picture || 'default-image.jpg'}
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <Title level={5} style={{ textAlign: 'center' }}>{city.city_name}</Title>
                  <Text><strong>Cost:</strong> ${city.city_cost}</Text>
                  <div className="locations">
                    <Text strong>Locations:</Text>
                    {city.locations.map((location) => (
                      <div key={location.location_id}>
                        <Text>{location.location_name}</Text>
                        <Text> | <strong>Price:</strong> ${location.location_price}</Text>
                        {location.location_picture && (
                          <Image
                            alt={location.location_name}
                            src={location.location_picture}
                            width={120}
                            height={80}
                            style={{ borderRadius: '4px', marginTop: '10px' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="hotels">
                    <Text strong>Hotels:</Text>
                    {city.hotels.map((hotel) => (
                      <div key={hotel.hotel_id}>
                        <Text>{hotel.hotel_name}</Text>
                        <Text> | <strong>Rooms:</strong> {hotel.num_rooms}</Text>
                        <Text> | <strong>Cost:</strong> ${hotel.hotel_cost}</Text>
                        {hotel.hotel_picture && (
                          <Image
                            alt={hotel.hotel_name}
                            src={hotel.hotel_picture}
                            width={120}
                            height={80}
                            style={{ borderRadius: '4px', marginTop: '10px' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Book Now Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" size="large">Book Now</Button>
      </div>
    </div>
  );
};

export default PackagePage;
