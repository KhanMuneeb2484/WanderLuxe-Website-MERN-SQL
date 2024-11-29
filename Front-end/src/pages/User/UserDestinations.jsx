import React from "react";

function Destinations() {
  // Dummy data for destinations
  const destinations = [
    {
      id: 1,
      name: "Indonesia",
      image: "assets/img/destination-1.jpg",
      description: "Explore the beautiful beaches and culture of Indonesia."
    },
    {
      id: 2,
      name: "Thailand",
      image: "assets/img/destination-2.jpg",
      description: "Discover the vibrant culture and islands of Thailand."
    },
    {
      id: 3,
      name: "Malaysia",
      image: "assets/img/destination-3.jpg",
      description: "Experience the modern city and tropical wonders of Malaysia."
    }
  ];

  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Destinations
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
                    Destinations
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Destinations
            </h6>
            <h1 className="mb-5">The Destinations We Offer:</h1>
          </div>
          <div className="row g-4 justify-content-center">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="destination-item card" style={{ cursor: "pointer" }}>
                  <div className="overflow-hidden">
                    <img
                      className="img-fluid card-img-top"
                      src={destination.image}
                      alt={destination.name}
                    />
                  </div>
                  <div className="text-center p-4">
                    <h3 className="mb-3">{destination.name}</h3>
                    <a
                      href="#"
                      className="btn btn-sm btn-primary"
                      style={{ borderRadius: "30px" }}
                    >
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Destinations;
