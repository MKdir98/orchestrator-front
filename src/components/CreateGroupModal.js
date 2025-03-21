import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};

function CreateGroupModal({ open, onClose, onCreateGroup }) {
	const [groupName, setGroupName] = useState("");
	const [rootUser, setRootUser] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = () => {
		if (!groupName || !rootUser || !description) {
			alert("Please enter both the group name and root user.");
			return;
		}
		onCreateGroup(groupName, rootUser, description);
		onClose();
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={style}>
				<Typography variant="h6" gutterBottom>
					Create New Group
				</Typography>
				<TextField
					fullWidth
					label="Group Name"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
					margin="normal"
				/>
				<TextField
					fullWidth
					label="Root User"
					value={rootUser}
					onChange={(e) => setRootUser(e.target.value)}
					margin="normal"
				/>
				<TextField
					fullWidth
					label="User Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					margin="normal"
					multiline
					rows={4}
					variant="outlined"
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					style={{ marginTop: "16px" }}
				>
					Create Group
				</Button>
			</Box>
		</Modal>
	);
}

export default CreateGroupModal;
