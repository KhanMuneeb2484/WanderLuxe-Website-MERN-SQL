import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Typography, Image, Spin } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const PackagePage = () => {
  const { packageId } = useParams();  // Get packageId from the URL
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch package data from API using packageId from the URL
    fetch(`http://localhost:3000/api/packages/get-package-by-id/${packageId}`)
      .then((response) => response.json())
      .then((data) => {
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

  if (!packageData || !packageData.packages) {
    return <Text>No package data available</Text>;
  }

  return (
    <div className="package-page">
      <Title level={2}>Package Details</Title>
      <Row gutter={16}>
        {packageData.packages.map((pkg) => (
          <Col span={8} key={pkg.package_id}>
            <Card
              hoverable
              cover={<Image alt={pkg.country_name} src={pkg.country_picture} />}
            >
              <Title level={4}>{pkg.country_name}</Title>
              <Text>Guide: {pkg.guide_name}</Text>
              <Text> | Per Day Charge: ${pkg.per_day_charge}</Text>
              <Text> | Total Price: ${pkg.total_price}</Text>
              <br />
              <Text>Duration: {pkg.total_days_stayed} days</Text>
              <Text> | People: {pkg.num_people}</Text>

              <div className="cities">
                {pkg.cities.map((city) => (
                  <div key={city.package_city_id} className="city">
                    <Image
                      alt={city.city_name}
                      src={city.city_picture || 'default-image.jpg'}
                      width={200}
                      height={150}
                    />
                    <Title level={5}>{city.city_name}</Title>
                    <Text>Cost: ${city.city_cost}</Text>
                    <div className="locations">
                      {city.locations.map((location) => (
                        <div key={location.location_id}>
                          <Text>{location.location_name}</Text>
                          <Text> | Price: ${location.location_price}</Text>
                          {location.location_picture && (
                            <Image
                              alt={location.location_name}
                              src={location.location_picture}
                              width={100}
                              height={75}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="hotels">
                      {city.hotels.map((hotel) => (
                        <div key={hotel.hotel_id}>
                          <Text>{hotel.hotel_name}</Text>
                          <Text> | Rooms: {hotel.num_rooms}</Text>
                          <Text> | Cost: ${hotel.hotel_cost}</Text>
                          {hotel.hotel_picture && (
                            <Image
                              alt={hotel.hotel_name}
                              src={hotel.hotel_picture}
                              width={100}
                              height={75}
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
        ))}
      </Row>
      <Button type="primary" style={{ marginTop: '20px' }}>Book Now</Button>
    </div>
  );
};

export default PackagePage;
