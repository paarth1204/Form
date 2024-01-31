import { useState, useEffect } from "react";
import Form from "./components/Form";
import Header from "./components/Header";
import { Delete, Edit } from "@mui/icons-material";
import { Button, Modal, Box } from "@mui/material";
import { useToasts } from "./hooks/useToasts";

export interface UserData {
  _id: string;
  name: string;
  age: number;
  role: string;
}

function App() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [open, setOpen] = useState(false);
  const { successToast, errorToast } = useToasts();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    handleCancelUpdate();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/data");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit = () => {
    fetchData();
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        successToast("User deleted successfully");
        fetchData();
      } else {
        errorToast("Error deleting user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateClick = (userId: string) => {
    handleOpen();
    setSelectedUserId(userId);
    setIsUpdateMode(true);
  };

  const handleCancelUpdate = () => {
    setSelectedUserId(null);
    setIsUpdateMode(false);
    handleClose(); // Close the modal when canceling the update
  };

  return (
    <div className="bg-zinc-200 h-screen">
      <Header />
      <Button onClick={handleOpen}>+ Add User</Button>
      <Modal open={open} onClose={handleClose}>
        <Box>
          <Form
            onFormSubmit={handleFormSubmit}
            selectedUserData={
              selectedUserId
                ? userData.find((user) => user._id === selectedUserId) || null
                : null
            }
            onCancelUpdate={handleCancelUpdate}
          />
        </Box>
      </Modal>
      <div>
        <ul className="list-none grid grid-cols-5 gap-4">
          {userData.map((user) => (
            <li
              key={user._id}
              className={`px-2 py-5 border-2 border-solid ${
                isUpdateMode && selectedUserId === user._id
                  ? "border-green-500"
                  : "border-zinc-500"
              } hover:bg-zinc-300 relative`}
            >
              <h3 className="font-semibold">{`Name: ${user.name}`}</h3>
              <p>{` Age: ${user.age}`}</p>
              <p>{`Role: ${user.role}`}</p>

              <Delete
                onClick={() => handleDelete(user._id)}
                style={{ cursor: "pointer", marginRight: "8px" }}
              />

              <Edit
                onClick={() => handleUpdateClick(user._id)}
                style={{ cursor: "pointer" }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
