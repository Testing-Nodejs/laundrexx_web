import React from "react";
import "../views/Portal/assets/css/animate.min.css";
import "../views/Portal/assets/css/bootstrap.min.css";
import "../views/Portal/assets/css/magnific.min.css";
import "../views/Portal/assets/css/nice-select.min.css";
import "../views/Portal/assets/css/slick-slide.min.css";
import "../views/Portal/assets/css/remixicon/remixicon.css";
import "../views/Portal/assets/css/style.css";
import "../views/Portal/assets/css/responsive.css";
import Image from "src/assets/images/laundrexxBackground.jpg";
import logo from "src/assets/images/WhiteLogo.webp";
import coat from "src/assets/images/6.png";
import diamond  from "src/assets/images/1.png";
import household  from "src/assets/images/2.png";
import shirts  from "src/assets/images/3.png";
import role  from "src/assets/images/4.png";
import clock  from "src/assets/images/5.png";


const d = new Date();
let year = d.getFullYear();

const Login = () => {

    return (
        <div>
            <header className="navbar-area">
                <nav className="navbar navbar-expand-lg" style={{ backgroundolor: "#0c8fcf" }}>
                    <div className="container nav-container">
                        <div className="responsive-mobile-menu">
                            <button className="menu toggle-btn d-block d-lg-none" data-target="#themefie_main_menu"
                                aria-expanded="false" aria-label="Toggle navigation" style={{ backgroundColor: "#ed3237" }}>
                                <span className="icon-left"></span>
                                <span className="icon-right"></span>
                            </button>
                        </div>
                        <div className="logo">
                            <a className="main-logo" href="/"><img src={(logo)} alt="img" style={{ width: "178px", height: "48px", objectfit: "fill" }} /></a>
                        </div>
                        <div className="collapse navbar-collapse" style={{ width: "79%" }} id="themefie_main_menu">
                            <ul className="navbar-nav menu-open" style={{ marginLeft: "400px" }}>
                                <li><a className="search" href="/OutletLogin">Outlet</a></li>
                                <li><a className="search" href="/FactoryLogin">Factory</a></li>
                                <li><a className="search" href="/ManagerLogin">Manager</a></li>
                                <li><a className="search" href="/AdminLogin">Super Admin</a></li>
                            </ul>
                        </div>

                        <div className="nav-right-part nav-right-part-mobile">
                            <ul>

                            </ul>
                        </div>
                        <div className="nav-right-part nav-right-part-desktop">
                            <ul>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <section className="banner-area" style={{ backgroundImage: "url(" + Image + ")", backgroundSize: "cover", backgroundPosition: "center", height: "618px" }}>

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 col-md-10 align-self-center">
                            <div className="banner-inner text-center">
                                <h4 style={{
                                    marginTop: "20px",
                                    fontSize: "40px",
                                    textAlign: "center", color: "#fff"
                                }}>WELCOME TO THE WORLD OF QUALITY AND CONVENIENCE</h4>
                                <div>
                                    <h6 style={{
                                        fontSize: "30px",
                                        textAlign: "center", color: "#fff", marginTop: "60px"
                                    }}>Welcome to the world of Laundrexx!</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="offer-area pd-top-120 pd-bottom-90">
                <div className="container">
                    <h2 className="text-center" style={{
                        arginTop: "-50px",
                        fontSize: "35px",
                        fontWeight: 100,
                        color: "#0c8fcf"
                    }}>Why Choose Us? </h2><br />
                    <div className="row justify-content-center">
                        <div className="col-md-3" style={{
                            borderLeft: "3px solid #0c8fcf",
                            textAlign: "center"
                        }}>
                            Express service <br></br>
                            (1-2 days)

                        </div>
                        <div className="col-md-3" style={{
                            borderLeft: "3px solid #0c8fcf",
                            textAlign: "center"
                        }}>
                            State of the art  <br></br>
                            technology

                        </div>
                        <div className="col-md-3" style={{
                            borderLeft: "3px solid #0c8fcf",
                            textAlign: "center"
                        }}>
                            Exceptional Quality

                        </div>
                        <div className="col-md-3" style={{
                            borderLeft: "3px solid #0c8fcf",
                            textAlign: "center",
                            borderRight: "3px solid #0c8fcf",
                        }}>
                            60+ store
                            <br></br>
                            locations

                        </div>
                    </div>
                </div>
            </section>
            <section className="blog-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-5 col-lg-7">
                            <div className="section-title text-center">
                                <h3 className="text-center" style={{
                                    marginTop: "60px",
                                    fontSize: "35px",
                                    fontWeight: 100,
                                    color: "#0c8fcf"
                                }}>Our Services</h3>
                                <p style={{fontFamily:""}}>Explore a plethora of amazing services offered by Laundrexx.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className=" col-md-1"></div>
                        <div className=" col-md-4">
                            <div className="single-blog-wrap">
                            <img src={(coat)} alt="img" style={{ width: "80px", borderRadius:"50%", marginBottom:"10px",padding:"8px",backgroundColor:"#a3d4ed" }} />
                                <h4 style={{
                                    fontSize: "20px",
                                    fontWeight: 100,
                                    color: "#0c8fcf"
                                }}> Dry Cleaning</h4>
                                <p>
                                    Our specialized dry cleaning service employs cutting-edge techniques to gently and effectively clean and refresh your delicate garments, ensuring they maintain their quality and integrity.
                                </p>
                            </div>
                        </div>
                        <div className=" col-md-2"></div>
                        <div className="col-md-4">
                            <div className="single-blog-wrap">
                                <div className="single-blog-wrap">
                                <img src={(diamond )} alt="img" style={{ width: "80px", borderRadius:"50%", marginBottom:"10px",padding:"8px",backgroundColor:"#a3d4ed"}} />
                                    <h4 style={{
                                        fontSize: "20px",
                                        fontWeight: 100,
                                        color: "#0c8fcf"
                                    }}>Premium Wash - Platina Care</h4>
                                    <p>
                                        Elevate your clothing care with our exclusive Platina Care service, offering premium and meticulous cleaning, ensuring your garments receive the utmost attention and maintenance, leaving them looking and feeling like new.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className=" col-md-1"></div>
                    </div>
                    <div className="row justify-content-center">
                        <div className=" col-md-1"></div>
                        <div className=" col-md-4">
                            <div className="single-blog-wrap">
                            <img src={(household )} alt="img" style={{  width: "80px", borderRadius:"50%", marginBottom:"10px",padding:"8px",backgroundColor:"#a3d4ed" }} />
                                <h4 style={{
                                    fontSize: "20px",
                                    fontWeight: 100,
                                    color: "#0c8fcf"
                                }}> Household</h4>
                                <p>
                                    Beyond clothing, we extend our expert cleaning services to household items, ensuring a thorough and meticulous cleaning process for all your home textiles. (Including Carpet, Rugs, Curtains)
                                </p>
                            </div>
                        </div>
                        <div className=" col-md-2"></div>
                        <div className="col-md-4">
                            <div className="single-blog-wrap">
                                <div className="single-blog-wrap">
                                <img src={(shirts )} alt="img" style={{  width: "80px", borderRadius:"50%", marginBottom:"10px",padding:"8px",backgroundColor:"#a3d4ed" }} />
                                    <h4 style={{
                                        fontSize: "20px",
                                        fontWeight: 100,
                                        color: "#0c8fcf"
                                    }}>Laundry - Wash & Fold</h4>
                                    <p>
                                        Simplify your laundry routine with our convenient wash and fold service, providing thorough and efficient cleaning for your everyday wear, so you can enjoy fresh, neatly folded clothes without the hassle.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className=" col-md-1"></div>
                    </div>
                    <div className="row justify-content-center">
                        <div className=" col-md-1"></div>
                        <div className=" col-md-4">
                            <div className="single-blog-wrap">
                            <img src={(clock )} alt="img" style={{  width: "80px", borderRadius:"50%", marginBottom:"10px",padding:"8px",backgroundColor:"#a3d4ed" }} />
                                <h4 style={{
                                    fontSize: "20px",
                                    fontWeight: 100,
                                    color: "#0c8fcf"
                                }}> Express Service</h4>
                                <p>
                                    Offering a swift turnaround without compromising on the quality of our meticulous cleaning process, ensuring your garments are ready for you in no time.
                                    2 day Express service
                                    1 day Urgent Service
                                </p>
                            </div>
                        </div>
                        <div className=" col-md-2"></div>
                        <div className="col-md-4">
                            <div className="single-blog-wrap">
                                <div className="single-blog-wrap">
                                <img src={(role )} alt="img" style={{ width: "80px", borderRadius:"50%", marginBottom:"10px",padding:"8px",backgroundColor:"#a3d4ed" }} />
                                    <h4 style={{
                                        fontSize: "20px",
                                        fontWeight: 100,
                                        color: "#0c8fcf"
                                    }}>Roll Press</h4>
                                    <p>
                                        Our specialized roll press service is tailored specifically for sarees and dhotis, ensuring they are meticulously cleaned and expertly pressed to maintain their intricate details and elegance, leaving you with impeccably finished garments.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className=" col-md-1"></div>
                    </div>
                </div>
            </section>

            <footer>
                <div style={{ backgroundColor: "#0c8fcf" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-5" style={{ marginTop: "50px" }}>
                                <h4 style={{ color: "#fff", fontSize: "24px" }}>Our Company</h4>
                                <p style={{ color: "#fff", fontSize: "16px" }}>With a reputation built on trust, reliability, and excellence, Laundrexx stands as a beacon of premium dry cleaning services in Tamil Nadu, consistently exceeding expectations and setting new standards in garment care.</p>
                            </div>
                            <div className="col-md-3" style={{ marginTop: "50px", paddingLeft: "110px" }}>
                                <h4 style={{ color: "#fff", fontSize: "24px" }}>Contact Us</h4>
                                <p style={{ color: "#fff", fontSize: "16px" }}>+91 938-000-0005 <br></br>
                                    info@laundrexx.com</p>
                            </div>
                            <div className="col-md-4" style={{ marginTop: "50px", paddingLeft: "105px" }}>
                                <h4 style={{ color: "#fff", fontSize: "24px" }}>Operating Hours</h4>
                                <p style={{ color: "#fff", fontSize: "16px" }}>
                                    Mon - Sat: 10am - 8pm <br></br>
                                    Sunday: 10am - 8pm (Select Stores)
                                </p>
                            </div>
                            <div className="col-md-1"></div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="row align-items-center" style={{ padding: 10 }}>
                            <span style={{ color: "#0c8fcf", textAlign: "center" }}>  © 2023 Laundrexx Fabric Care India Pvt Ltd. All rights reserved</span>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="back-to-top">
                <span className="back-top"><i className="fas fa-angle-double-up"></i></span>
            </div>
        </div>
    );
};

export default Login;
