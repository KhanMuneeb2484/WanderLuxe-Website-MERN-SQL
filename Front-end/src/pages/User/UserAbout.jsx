import React from 'react';

function About() {
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                About Us
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    About
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
        
      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div
              className="col-lg-6 wow fadeInUp"
              data-wow-delay="0.1s"
              style={{ minHeight: 400 }}
            >
              <div className="position-relative h-100">
                <img
                  className="img-fluid position-absolute w-100 h-100"
                  src="assets/img/tour-guide-rules.jpg"
                  alt=""
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <h6 className="section-title bg-white text-start text-primary pe-3">
                About Us
              </h6>
              <h1 className="mb-4">
                Welcome to <span className="text-primary">Wander Luxe</span>
              </h1>
              <p className="mb-4">
                Wander Luxe is your ultimate travel partner, providing you with unforgettable experiences across the globe. Whether you're planning a relaxing getaway or an adventurous exploration, we offer the best packages to suit your needs.
              </p>
              <p className="mb-4">
                We specialize in offering luxurious and customizable travel packages, featuring first-class flights, handpicked hotels, and personalized tours. Your comfort and satisfaction are our top priority, and we're here to help you plan the trip of your dreams.
              </p>
              <div className="row gy-2 gx-4 mb-4">
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    First Class Flights
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Handpicked Hotels
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />5 Star
                    Accommodations
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Latest Model Vehicles
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    150 Premium City Tours
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    24/7 Customer Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}
        
      {/* Meet the Devs Start */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Meet the Devs
            </h6>
            <h1 className="mb-5">Our Creative Team</h1>
          </div>
          <div className="row justify-content-center gy-4">
            <div className="col-lg-3 col-md-4 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.1s">
              <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                <img src="assets/img/muneeb2.jpeg" alt="Dev 1" className="img-fluid" />
              </div>
              <h5 className="mb-1">Muneeb Ullah</h5>
              <p>Lead Developer</p>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.3s">
              <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                <img src="assets/img/raahim.jpeg" alt="Dev 2" className="img-fluid" />
              </div>
              <h5 className="mb-1">Raahim</h5>
              <p>Frontend Developer</p>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.5s">
              <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                <img src="assets/img/aawaix.jpeg" alt="Dev 3" className="img-fluid" />
              </div>
              <h5 className="mb-1">Aawaiz</h5>
              <p>Backend Developer</p>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.7s">
              <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '150px', height: '150px' }}>
                <img src="assets/img/shuja.jpeg" alt="Dev 4" className="img-fluid" />
              </div>
              <h5 className="mb-1">Shuja</h5>
              <p>UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
      {/* Meet the Devs End */}
    </div>
  );
}

export default About;
