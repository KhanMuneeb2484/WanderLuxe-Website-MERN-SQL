import React from "react";

function UserBooking() {
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Booking
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
                    Booking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Process Start */}
<div className="container-xxl py-5">
  <div className="container">
    <div className="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
      <h6 className="section-title bg-white text-center text-primary px-3">
        Booking Process
      </h6>
      <h1 className="mb-5">3 Easy Steps</h1>
    </div>
    <div className="row gy-5 gx-4 justify-content-center">
      <div
        className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
        data-wow-delay="0.1s"
      >
        <div className="position-relative border border-primary pt-5 pb-4 px-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
            style={{ width: 100, height: 100 }}
          >
            <i className="fa fa-calendar-check fa-3x text-white" />
          </div>
          <h5 className="mt-4">Select Your Package</h5>
          <hr className="w-25 mx-auto bg-primary mb-1" />
          <hr className="w-50 mx-auto bg-primary mt-0" />
          <p className="mb-0">
            Browse through available tour packages and choose the one that fits your preferences. 
            Select destinations, dates, and number of people.
          </p>
        </div>
      </div>
      <div
        className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
        data-wow-delay="0.3s"
      >
        <div className="position-relative border border-primary pt-5 pb-4 px-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
            style={{ width: 100, height: 100 }}
          >
            <i className="fa fa-user-check fa-3x text-white" />
          </div>
          <h5 className="mt-4">Enter Your Details</h5>
          <hr className="w-25 mx-auto bg-primary mb-1" />
          <hr className="w-50 mx-auto bg-primary mt-0" />
          <p className="mb-0">
            Provide your personal details, including your name, contact information, and any other necessary information for the booking.
          </p>
        </div>
      </div>
      <div
        className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
        data-wow-delay="0.5s"
      >
        <div className="position-relative border border-primary pt-5 pb-4 px-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
            style={{ width: 100, height: 100 }}
          >
            <i className="fa fa-credit-card fa-3x text-white" />
          </div>
          <h5 className="mt-4">Complete Payment</h5>
          <hr className="w-25 mx-auto bg-primary mb-1" />
          <hr className="w-50 mx-auto bg-primary mt-0" />
          <p className="mb-0">
            Securely make your payment through our online platform. We support multiple payment methods to suit your convenience.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
{/* Process End */}
      {/* Process Start */}
      {/* Booking Start */}
      <div className="container-xxl py-5 wow fadeInUp " data-wow-delay="0.1s">
        <div className="container">
          <div className="booking p-5">
            <div className="row g-5 justify-content-center align-items-center">
              <div className="col-md-6 text-white">
                <h6 className="text-white text-uppercase">Booking</h6>
                <h1 className="text-white mb-4">Online Booking</h1>
                <p className="mb-4">
                  Book your next adventure with ease. We offer a seamless online
                  booking experience that allows you to explore and reserve your
                  dream destinations. From flights to accommodations, everything
                  you need is just a click away.
                </p>
                <p className="mb-4">
                  Whether you're planning a relaxing getaway or an exciting
                  adventure, our platform provides you with a wide variety of
                  options to choose from. Enjoy quick and secure bookings,
                  making your travel planning effortless and enjoyable.
                </p>
              
                <a
                className="btn btn-outline-light py-3 px-4 mt-2 text-xl"
                href="/packages"
              >
                Choose a Package
              </a>
              </div>
              
            </div>
              
          </div>
        </div>
      </div>
      {/* Booking Start */}
    </div>
  );
}

export default UserBooking;
