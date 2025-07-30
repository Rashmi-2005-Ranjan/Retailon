import "./ManageUsers.css"
import UserForm from "../../Components/User Form/UserForm.jsx";
import UserList from "../../Components/User List/UserList.jsx";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {fetchUsers} from "../../Services/UserService.js";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function loadUsers() {
            try {
                setLoading(true);
                const response = await fetchUsers()
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Unable To Fetch Users");
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);
    return (
        <>
            <div className="users-container text-light">
                <div className="left-column">
                    <UserForm setUsers={setUsers}/>
                </div>
                <div className="right-column">
                    {loading?"Loading...":<UserList users={users} setUsers={setUsers} />}
                </div>
            </div>
        </>
    )
}
export default ManageUsers;