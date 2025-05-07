import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Typography, Image, Spin, Divider, Tag, Space, Carousel, Statistic } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  StarOutlined,
  CompassOutlined,
  BankOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import './PackagePage.css';

const { Title, Text, Paragraph } = Typography;

const PackagePage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const handleBookPackage = (packageId) => {
    navigate(`/booking/${packageId}`, { state: { isCustomPackage: false } });
  };

  useEffect(() => {
    // Fetch package data from API using packageId from the URL
    fetch(`http://localhost:3000/api/adminPackages/get-package-by-id/${packageId}`)
      .then((response) => response.json())
      .then((data) => {
        setPackageData(data.adminPackages[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching package data:', error);
        setLoading(false);
      });
  }, [packageId]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text className="loading-text">Loading your dream destination...</Text>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="error-container">
        <Title level={3}>Package Not Found</Title>
        <Text>We couldn't find the package you're looking for. Please try again.</Text>
      </div>
    );
  }

  const pkg = packageData;

  return (
    <div className="package-page">
      {/* Hero Section */}
      <div className="hero-section" style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${pkg.country_picture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 0',
        marginBottom: '30px'
      }}>
        <div className="hero-content">
          <Title level={1} style={{ color: 'white', marginBottom: '5px' }}>{pkg.country_name}</Title>
          <Title level={3} style={{ color: 'white', fontWeight: 'normal', margin: 0 }}>
            {pkg.total_days_stayed} Days • {pkg.cities.length} Cities • Guided Tour
          </Title>
          <div className="hero-price">
            <Tag color="gold" style={{ fontSize: '16px', padding: '5px 10px', margin: '10px 0' }}>
              <DollarOutlined /> ${pkg.total_price}
            </Tag>
          </div>
        </div>
      </div>

      <div className="package-container">
        {/* Overview Section */}
        <Row gutter={[24, 24]} className="overview-section">
          <Col xs={24} md={16}>
            <Card className="overview-card">
              <Title level={3}>Package Overview</Title>
              <Paragraph>
                Experience the beauty and culture of {pkg.country_name} with our exclusive guided tour.
                Explore {pkg.cities.length} stunning cities over {pkg.total_days_stayed} unforgettable days.
              </Paragraph>
              
              <Row gutter={[16, 16]} className="package-stats">
                <Col xs={12} sm={6}>
                  <Statistic 
                    title="Duration" 
                    value={pkg.total_days_stayed} 
                    suffix="Days" 
                    prefix={<CalendarOutlined />} 
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic 
                    title="Travelers" 
                    value={pkg.num_people} 
                    prefix={<TeamOutlined />} 
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic 
                    title="Per Day" 
                    value={pkg.per_day_charge} 
                    prefix={<DollarOutlined />} 
                    precision={2} 
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic 
                    title="Cities" 
                    value={pkg.cities.length} 
                    prefix={<HomeOutlined />} 
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="guide-card">
              <div className="guide-info">
                <Title level={4}>Your Guide</Title>
                <div className="guide-profile">
                  <div className="guide-avatar">
                    <div className="avatar-placeholder">
                      {pkg.guide_name.charAt(0)}
                    </div>
                  </div>
                  <div className="guide-details">
                    <Text strong>{pkg.guide_name}</Text>
                    <div>
                      <Tag color="blue">Professional Guide</Tag>
                    </div>
                    <Rate disabled defaultValue={5} />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="booking-card" style={{ marginTop: '20px' }}>
              <Title level={4}>Ready to book?</Title>
              <Paragraph>Secure your spot now for this amazing journey!</Paragraph>
              <Button 
                type="primary" 
                size="large" 
                icon={<ShoppingCartOutlined />} 
                block
                onClick={() => handleBookPackage(packageId)}
              >
                Book This Package
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Cities Section */}
        <Title level={3} className="section-title">
          <CompassOutlined /> Destinations
        </Title>
        
        {pkg.cities.map((city, index) => (
          <Card 
            key={city.package_city_id} 
            className="city-card"
            style={{ marginBottom: '30px' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Image
                  alt={city.city_name}
                  src={city.city_picture || 'default-image.jpg'}
                  style={{ objectFit: 'cover', borderRadius: '8px', width: '100%', height: '220px' }}
                />
              </Col>
              
              <Col xs={24} md={16}>
                <div className="city-details">
                  <div className="city-header">
                    <Title level={3}>{city.city_name}</Title>
                    <Tag color="green" style={{ fontSize: '14px' }}>
                      <DollarOutlined /> ${city.city_cost}
                    </Tag>
                  </div>
                  
                  <Divider orientation="left">
                    <StarOutlined /> Attractions
                  </Divider>
                  
                  <Row gutter={[16, 16]} className="locations-grid">
                    {city.locations.map((location) => (
                      <Col xs={24} sm={12} md={8} key={location.location_id}>
                        <Card
                          size="small"
                          cover={
                            <Image
                              alt={location.location_name}
                              src={location.location_picture || 'default-location.jpg'}
                              style={{ height: '120px', objectFit: 'cover' }}
                              preview={true}
                            />
                          }
                        >
                          <Card.Meta
                            title={location.location_name}
                            description={`$${location.location_price}`}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  
                  <Divider orientation="left">
                    <BankOutlined /> Accommodations
                  </Divider>
                  
                  <Row gutter={[16, 16]} className="hotels-grid">
                    {city.hotels.map((hotel) => (
                      <Col xs={24} sm={12} key={hotel.hotel_id}>
                        <Card size="small" className="hotel-card">
                          <Row gutter={16} align="middle">
                            <Col xs={24} sm={8}>
                              <Image
                                alt={hotel.hotel_name}
                                src={hotel.hotel_picture || 'default-hotel.jpg'}
                                style={{ borderRadius: '4px', width: '100%', height: '80px', objectFit: 'cover' }}
                                preview={true}
                              />
                            </Col>
                            <Col xs={24} sm={16}>
                              <Title level={5} style={{ margin: '0 0 5px 0' }}>{hotel.hotel_name}</Title>
                              <Space direction="vertical" size={0}>
                                <Text><TeamOutlined /> {hotel.num_rooms} rooms</Text>
                                <Text><DollarOutlined /> ${hotel.hotel_cost}</Text>
                              </Space>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
        
        {/* Call to Action */}
        <Card className="cta-card">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={14}>
              <Title level={3}>Book Your Dream {pkg.country_name} Adventure</Title>
              <Paragraph>
                Don't miss out on this incredible {pkg.total_days_stayed}-day journey through {pkg.country_name}!
                Book now to secure your spot.
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Title level={4} style={{ margin: '0 0 10px 0' }}>
                Total: ${pkg.total_price}
              </Title>
              <Button 
                type="primary" 
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleBookPackage(packageId)}
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

// Add Rate component needed in the code
const Rate = ({ disabled, defaultValue }) => {
  return (
    <div className="rate">
      {[...Array(5)].map((_, index) => (
        <StarOutlined key={index} style={{ color: index < defaultValue ? '#fadb14' : '#d9d9d9' }} />
      ))}
    </div>
  );
};

export default PackagePage;