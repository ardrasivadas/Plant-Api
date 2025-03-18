import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create axios instance with base URL outside the component
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    timeout: 10000
  });
  
  // Function to get authenticated API configuration
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };
  
  const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for user data and stats
    const [userData, setUserData] = useState({
      name: "",
      email: "",
      phone: "",
      place: ""
    });
    
    const [userStats, setUserStats] = useState({
      publications: 0,
      citations: 0,
      collaborators: 0,
      recentActivity: []
    });
  
    // Function to handle navigation to search page
    const handleSearchNavigation = () => {
      navigate("/search");
    };
    
    // Fetch user profile data
    useEffect(() => {
      const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // Verify token exists
          const token = localStorage.getItem("token");
          
          if (!token) {
            console.log("No token found, redirecting to signin");
            navigate("/signin");
            return;
          }
          
          // Token validation check
          try {
            // Simple token validation (check if it's in JWT format)
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
              console.error("Invalid token format");
              localStorage.removeItem("token");
              navigate("/signin");
              return;
            }
          } catch (tokenError) {
            console.error("Token validation error:", tokenError);
            localStorage.removeItem("token");
            navigate("/signin");
            return;
          }
          
          // Get auth config
          const config = getAuthConfig();
          
          // Fetch user profile and stats in parallel
          const [profileResponse, statsResponse] = await Promise.all([
            api.get("/api/user/profile", config),
            api.get("/api/user/stats", config)
          ]);
          
          console.log("Profile data received:", profileResponse.data);
          console.log("Stats data received:", statsResponse.data);
          
          // Update state with response data
          setUserData(profileResponse.data.user);
          setUserStats(statsResponse.data.stats);
        } catch (err) {
          console.error("Error fetching user data:", err);
          
          // Detailed error handling
          if (err.response) {
            // Request was made and server responded with error
            console.error("Server response error:", err.response.data);
            console.error("Status code:", err.response.status);
            
            if (err.response.status === 401) {
              console.log("Unauthorized access, redirecting to signin");
              localStorage.removeItem("token");
              navigate("/signin");
            } else if (err.response.status === 404) {
              setError("User profile not found. Please check your account.");
            } else {
              setError(`Server error: ${err.response.data.message || "Unknown error"}`);
            }
          } else if (err.request) {
            // Request was made but no response received
            console.error("No response received:", err.request);
            setError("Unable to connect to the server. Please check your internet connection.");
          } else {
            // Error in request setup
            console.error("Request setup error:", err.message);
            setError("An error occurred while setting up the request.");
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    }, [navigate]);
  
    // Calculate research interests (placeholder)
    const researchInterests = ["Machine Learning", "Data Science", "Natural Language Processing"];
  
    // Loading state
    if (isLoading) {
      return (
        <div style={{ 
          background: "#1a1a2e", 
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff"
        }}>
          <div className="text-center">
            <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Loading profile...</div>
            <div style={{ 
              width: "50px", 
              height: "50px", 
              border: "5px solid rgba(255,255,255,0.3)",
              borderTop: "5px solid #e94560",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite"
            }}></div>
          </div>
        </div>
      );
    }
  
    // Error state
    if (error) {
      return (
        <div style={{ 
          background: "#1a1a2e", 
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff"
        }}>
          <div className="text-center">
            <div style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#e94560" }}>
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#4361ee",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

  return (
    <div className="profile-page" style={{ 
      background: "#1a1a2e", 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      color: "#ffffff",
      overflow: "hidden",
      position: "relative",
      paddingTop: "80px"
    }}>
      {/* Animated background elements */}
      <div className="background-elements" style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <motion.div 
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(67, 97, 238, 0.15) 0%, rgba(67, 97, 238, 0) 70%)",
            top: "15%",
            right: "10%",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233, 69, 96, 0.2) 0%, rgba(233, 69, 96, 0) 70%)",
            bottom: "10%",
            left: "5%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <Container fluid className="p-0">
        {/* Header/Navigation Area */}
        <motion.div 
          className="py-4 px-4 px-md-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Row className="align-items-center">
            <Col xs={6} md={4}>
              <div className="d-flex align-items-center">
                <div style={{ 
                  background: "#4361ee",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#fff" strokeWidth="2"/>
                    <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{ 
                  marginLeft: "10px", 
                  fontSize: "1.3rem", 
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  color: "#ffffff" 
                }}>
                  Profile
                </span>
              </div>
            </Col>
            <Col xs={6} md={8} className="d-flex justify-content-end">
              <div className="d-none d-md-flex">
                {["Dashboard", "Settings", "Logout"].map((item, index) => (
                  <div 
                    key={index} 
                    className="mx-3" 
                    style={{ 
                      cursor: "pointer", 
                      fontWeight: "500",
                      opacity: 0.8,
                      transition: "opacity 0.3s ease"
                    }}
                    onClick={() => {
                      if (item === "Logout") {
                        localStorage.removeItem("token");
                        navigate("/signin");
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </motion.div>

        {/* Main Content Area */}
        <main style={{ flex: "1" }}>
          <Row className="mx-0 mt-4 mt-md-5 align-items-center">
            <Col md={5} className="px-4 px-md-5 mb-5 mb-md-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-5">
                  <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4361ee, #e94560)",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: "#fff",
                    border: "4px solid rgba(255,255,255,0.2)"
                  }}>
                    {userData.name ? userData.name.charAt(0) : "?"}
                  </div>
                  <h2 style={{ 
                    fontSize: "2rem", 
                    fontWeight: "700",
                    marginTop: "1rem",
                    color: "#ffffff"
                  }}>
                    {userData.name || "Loading..."}
                  </h2>
                  <p style={{ 
                    fontSize: "1.1rem", 
                    opacity: 0.8,
                    marginBottom: "0.5rem"
                  }}>
                    Researcher
                  </p>
                  <p style={{ 
                    fontSize: "1rem", 
                    opacity: 0.6,
                  }}>
                    {userData.place || "Location not specified"}
                  </p>
                </div>
                
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#e94560" }}>Contact Information</h3>
                  <div className="mb-3">
                    <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>Email</div>
                    <div>{userData.email || "Not provided"}</div>
                  </div>
                  <div className="mb-3">
                    <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>Phone</div>
                    <div>{userData.phone || "Not provided"}</div>
                  </div>
                  <div>
                    <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>Location</div>
                    <div>{userData.place || "Not provided"}</div>
                  </div>
                </div>
                
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", color: "#4361ee" }}>Research Interests</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {researchInterests.map((interest, index) => (
                      <div key={index} style={{
                        background: "rgba(67, 97, 238, 0.15)",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "0.9rem"
                      }}>
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Col>
            
            <Col md={7} className="px-4 px-md-5">
              <motion.div
                className="position-relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "25px",
                  marginBottom: "25px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "20px", color: "#e94560" }}>Research Statistics</h3>
                  
                  <Row>
                    {[
                      { label: "Publications", value: userStats.publications, icon: "📚" },
                      { label: "Citations", value: userStats.citations, icon: "📝" },
                      { label: "Collaborators", value: userStats.collaborators, icon: "👥" }
                    ].map((stat, index) => (
                      <Col key={index} md={4} className="mb-4">
                        <div style={{
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: "10px",
                          padding: "15px",
                          textAlign: "center",
                          height: "100%"
                        }}>
                          <div style={{ fontSize: "1.5rem", marginBottom: "5px" }}>{stat.icon}</div>
                          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#4361ee" }}>{stat.value}</div>
                          <div style={{ opacity: 0.7 }}>{stat.label}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "25px",
                  marginBottom: "25px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "20px", color: "#4361ee" }}>Recent Activity</h3>
                  
                  {userStats.recentActivity && userStats.recentActivity.length > 0 ? (
                    userStats.recentActivity.map((activity, index) => (
                      <div key={index} style={{
                        borderBottom: index < userStats.recentActivity.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                        paddingBottom: index < userStats.recentActivity.length - 1 ? "15px" : "0",
                        marginBottom: index < userStats.recentActivity.length - 1 ? "15px" : "0",
                      }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>{activity.title}</div>
                            <div style={{ opacity: 0.6, fontSize: "0.9rem", marginTop: "5px" }}>{activity.date}</div>
                          </div>
                          <div style={{
                            background: activity.type === "Publication" ? "rgba(233, 69, 96, 0.15)" : 
                                      activity.type === "Search" ? "rgba(67, 97, 238, 0.15)" : "rgba(255,255,255,0.1)",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            fontSize: "0.8rem"
                          }}>
                            {activity.type}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4" style={{ opacity: 0.7 }}>
                      No recent activity to display
                    </div>
                  )}
                </div>
                
                {/* Search button area */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-center mt-4"
                >
                  <button 
                    onClick={handleSearchNavigation}
                    className="search-btn text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
                    style={{
                      backgroundColor: "#4361ee",
                      boxShadow: "0 10px 20px rgba(67, 97, 238, 0.3)",
                      width: "200px"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 15px 25px rgba(67, 97, 238, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(67, 97, 238, 0.3)";
                    }}
                  >
                    Search Researchers
                  </button>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </main>
      </Container>
    </div>
  );
};

export default Profile;