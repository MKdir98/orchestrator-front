import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import GroupList from "./components/GroupList";
import UserTree from "./components/UserTree";
import CreateGroupModal from "./components/CreateGroupModal";
import { getGroups, createGroup } from "./services/api";

function App() {
	const [groups, setGroups] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		getGroups()
			.then((response) => {
				setGroups(response.data);
			})
			.catch((error) => {
				console.error("Error fetching groups:", error);
			});
	}, []);

	const handleCreateGroup = (name, rootUser, description) => {
		createGroup(name, rootUser, description)
			.then((response) => {
				alert(response.data.message);
				setGroups([...groups, response.data.data]);
			})
			.catch((error) => {
				console.error("Error creating group:", error);
			});
	};

	return (
		<div className="App" style={{ padding: "20px" }}>
			<Typography variant="h3" gutterBottom>
				Orchestrator UI
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={() => setIsModalOpen(true)}
			>
				Create New Group
			</Button>
			<GroupList groups={groups} onGroupClick={setSelectedGroup} />
			{selectedGroup && (
				<>
					<Typography variant="h4" gutterBottom>
						Users in Group {selectedGroup}
					</Typography>
					<UserTree groupId={selectedGroup} />
				</>
			)}
			<CreateGroupModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreateGroup={handleCreateGroup}
			/>
		</div>
	);
}

export default App;
