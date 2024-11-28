import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Destination() {
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white fw-bold animated slideInDown">
                Countries
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center bg-transparent">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-white">
                      Home
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Countries
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Destination Start */}
      <div className="container-xxl py-5 destination">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3 d-inline-block">
              Destination
            </h6>
            <h1 className="mb-5 fw-bold">Popular Destinations</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-7 col-md-6">
              <div className="row g-4">
                <div
                  className="col-lg-12 col-md-12 wow zoomIn"
                  data-wow-delay="0.1s"
                >
                  <a
                    className="position-relative d-block overflow-hidden rounded shadow-sm"
                    href=""
                  >
                    <img
                      className="img-fluid rounded"
                      src="assets/img/destination-1.jpg"
                      alt="Thailand"
                    />
                    <div className="badge bg-danger text-white position-absolute top-0 start-0 m-3 py-2 px-3 fs-6 shadow-sm">
                      30% OFF
                    </div>
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-3 rounded shadow-sm">
                      Thailand
                    </div>
                  </a>
                </div>
                <div
                  className="col-lg-6 col-md-12 wow zoomIn"
                  data-wow-delay="0.3s"
                >
                  <a
                    className="position-relative d-block overflow-hidden rounded shadow-sm"
                    href=""
                  >
                    <img
                      className="img-fluid rounded"
                      src="assets/img/destination-2.jpg"
                      alt="Malaysia"
                    />
                    <div className="badge bg-danger text-white position-absolute top-0 start-0 m-3 py-2 px-3 fs-6 shadow-sm">
                      25% OFF
                    </div>
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-3 rounded shadow-sm">
                      Malaysia
                    </div>
                  </a>
                </div>
                <div
                  className="col-lg-6 col-md-12 wow zoomIn"
                  data-wow-delay="0.5s"
                >
                  <a
                    className="position-relative d-block overflow-hidden rounded shadow-sm"
                    href=""
                  >
                    <img
                      className="img-fluid rounded"
                      src="assets/img/destination-3.jpg"
                      alt="Australia"
                    />
                    <div className="badge bg-danger text-white position-absolute top-0 start-0 m-3 py-2 px-3 fs-6 shadow-sm">
                      35% OFF
                    </div>
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-3 rounded shadow-sm">
                      Australia
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-lg-5 col-md-6 wow zoomIn"
              data-wow-delay="0.7s"
              style={{ minHeight: 350 }}
            >
              <a
                className="position-relative d-block h-100 overflow-hidden rounded shadow-sm"
                href=""
              >
                <img
                  className="img-fluid position-absolute w-100 h-100 rounded"
                  src="assets/img/destination-4.jpg"
                  alt="Indonesia"
                  style={{ objectFit: "cover" }}
                />
                <div className="badge bg-danger text-white position-absolute top-0 start-0 m-3 py-2 px-3 fs-6 shadow-sm">
                  20% OFF
                </div>
                <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-3 rounded shadow-sm">
                  Indonesia
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Destination End */}
    </div>
  );
}

export default Destination;
