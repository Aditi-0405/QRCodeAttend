
import { Link } from 'react-router-dom';
import '../SharedStyling/HomePage.css'

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Attendance Record Management System</h1>
      <p className="homepage-description">Welcome to the Attendance Record Management System. Please choose an option below:</p>
      <div className="homepage-buttons">
        <Link to="/student-login">
          <button className="homepage-button">Student Login</button>
        </Link>
        <Link to="/admin-login">
          <button className="homepage-button">Admin Login</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;