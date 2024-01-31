import { useState, useEffect } from "react";
import { UserData } from "../App";
import { Typography, Button } from "@mui/material";
import { Close } from "@mui/icons-material"; // Import Close icon
import { useToasts } from "../hooks/useToasts";

interface FormProps {
  onFormSubmit: () => void;
  selectedUserData: UserData | null;
  onCancelUpdate: () => void;
}

const Form: React.FC<FormProps> = ({
  onFormSubmit,
  selectedUserData,
  onCancelUpdate,
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const { successToast, errorToast } = useToasts();

  useEffect(() => {
    if (selectedUserData) {
      // Populate form fields with selected user data if in update mode
      setName(selectedUserData.name);
      setAge(selectedUserData.age.toString());
      setRole(selectedUserData.role);
    } else {
      // Reset form fields if not in update mode
      setName("");
      setAge("");
      setRole("");
    }
  }, [selectedUserData]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Determine the API endpoint and HTTP method based on whether it's update or submit
    const endpoint = selectedUserData
      ? `http://localhost:3000/update/${selectedUserData._id}`
      : "http://localhost:3000/submit";
    const method = selectedUserData ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age, role }),
      });

      if (response.ok) {
        successToast(
          selectedUserData
            ? "User updated successfully"
            : "User Added successfully"
        );
        // Optionally, you can reset the form fields here
        setName("");
        setAge("");
        setRole("");
        onFormSubmit();
        onCancelUpdate(); // Reset update mode
      } else {
        errorToast(
          selectedUserData ? "Error updating user" : "Error submitting form"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div
        className="bg-zinc-400 p-8 rounded-md relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks on the form from closing it
      >
        <Button
          onClick={onCancelUpdate}
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          <Close />
        </Button>
        <form className="grid grid-cols-2 gap-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="name">
              <Typography variant="h6" className="mb-2">
                Name:
              </Typography>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="age">
              <Typography variant="h6" className="mb-2">
                Age:
              </Typography>{" "}
            </label>
            <input
              type="number"
              id="age"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="role">
              <Typography variant="h6" className="mb-2">
                Role:
              </Typography>{" "}
            </label>
            <input
              type="text"
              id="role"
              placeholder="Enter your role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </form>
        <div className="mt-4">
          <Button
            onClick={handleClick}
            variant="contained"
            sx={{
              backgroundColor: selectedUserData ? "#4caf50" : "#2196f3",
              color: "#fff",
              marginRight: "8px",
            }}
          >
            {selectedUserData ? "Update" : "Submit"}
          </Button>
          {selectedUserData && (
            <Button
              variant="contained"
              onClick={onCancelUpdate}
              sx={{ backgroundColor: "#f44336", color: "#fff" }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
