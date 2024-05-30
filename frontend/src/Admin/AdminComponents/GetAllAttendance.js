import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminStyling/AdminPage.css';

const GetAllAttendance = () => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAttendanceData = async () => {
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/api/admin/getAllAttendance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (typeof response.data === 'object' && response.data !== null) {
                const attendanceArray = Object.entries(response.data).map(([studentId, attendanceObj]) => {
                    return { studentId, ...attendanceObj };
                });
                setAttendanceData(attendanceArray);
            } else {
                setAttendanceData([]);
                setError('Invalid attendance data format');
            }
        } catch (error) {
            setError('Error fetching attendance data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    return (
        <div className="attendance-section">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                attendanceData && (
                    <div className="attendance-data">
                        <h2>All Attendance Records</h2>
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    {Object.keys(attendanceData[0]).filter(key => key !== 'studentId').map(date => (
                                        <th key={date}>{date}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map((record) => (
                                    <tr key={record.studentId}>
                                        <td>{record.studentId}</td>
                                        {Object.values(record).filter((value, index) => index !== 0).map((value, index) => (
                                            <td key={index}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default GetAllAttendance;
