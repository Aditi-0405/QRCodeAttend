
import {useNavigate, Link } from 'react-router-dom';
import '../SharedStyling/NavBar.css'

const NavBar = ({isLoggedIn, setIsLoggedIn})=>{
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const handleLogout = () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      navigate('/'); 
    };

    return (
        <nav className="app-nav">
        <ul className="nav-list">
          {!isLoggedIn && <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>}
          {!isLoggedIn && <li className="nav-item"><Link to="/student-login" className="nav-link">Student Login</Link></li>}
          {!isLoggedIn && <li className="nav-item"><Link to="/admin-login" className="nav-link">Admin Login</Link></li>}
          {isLoggedIn && userRole === 'student' && (
            <>
              <li className="nav-item"><Link to="/student" className="nav-link">Home</Link></li>
              <li className="nav-item"><span className="nav-link">User ID: {localStorage.getItem('userId')}</span></li>
              <li className="nav-item"><button onClick={handleLogout} className="nav-link logout-btn">Logout</button></li>
            </>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <>
              <li className="nav-item"><Link to="/admin" className="nav-link">Home</Link></li>
              <li className="nav-item"><span className="nav-link">User ID: {localStorage.getItem('userId')}</span></li>
              <li className="nav-item"><button onClick={handleLogout} className="nav-link logout-btn">Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    )
}
export default NavBar
